import { extname, join } from "path";
import { readFile, readdir } from "node:fs/promises";

import { execute } from "../helpers/spawn";
import { fileExists } from "../helpers/file-exists";
import { waitInSeconds } from "../helpers/wait-in-seconds";
import { removeSpecialChars } from "../helpers/remove-special-chars";

import { IStatelessPlugin } from "./types/IStatelessPlugin";
import { IAction, IHasuraEngine } from "./types/IHasuraEngine";

import { getConfig } from "./GluestackConfig";
import HasuraMetadata from "./HasuraMetadata";
import GluestackEvent from "./GluestackEvent";

/**
 * HasuraEngine class
 *
 * This class is responsible applying metadata, recreate actions
 * with the custom types & recreate events into Hasura Engine.
 */
export default class HasuraEngine implements IHasuraEngine {
  public pluginName: string;
  public actionPlugins: IStatelessPlugin[];

  private metadata: any;
  private events: any;
  private actions: IAction[];
  private actionGQLFile: string = 'action.graphql';
  private actionSettingFile: string = 'action.setting';

  constructor(
    actionPlugins: IStatelessPlugin[]
  ) {
    this.actions = [];
    this.pluginName = getConfig('hasuraInstancePath');
    this.actionPlugins = actionPlugins;

    this.metadata = new HasuraMetadata(this.pluginName);
    this.events = new GluestackEvent(this.pluginName);
  }

  // Sync hasura engine's metadata with the local hasura metadata
  public async exportMetadata(): Promise<void> {
    const filepath = join(process.cwd(), getConfig('backendInstancePath'), 'functions', this.pluginName);

    await execute('hasura', [
      'metadata',
      'export',
      '--skip-update-check'
    ], {
      cwd: filepath,
      stdio: 'inherit'
    });
  }

  // Apply local metadata to the hasura engine's metadata
  public async applyMetadata(): Promise<void> {
    const filepath = join(process.cwd(), getConfig('backendInstancePath'), 'functions', this.pluginName);

    await execute('hasura', [
      'metadata',
      'apply',
      '--skip-update-check'
    ], {
      cwd: filepath,
      stdio: 'inherit'
    });
  }

  // Apply local migrations to the hasura engine's migrations
  public async applyMigrate(): Promise<void> {
    const hasuraEnvs = this.metadata.hasuraEnvs;
    const filepath = join(process.cwd(), getConfig('backendInstancePath'), 'functions', this.pluginName);

    await execute('hasura', [
      'migrate',
      'apply',
      '--database-name',
      hasuraEnvs.HASURA_GRAPHQL_DB_NAME,
      '--skip-update-check'
    ], {
      cwd: filepath,
      stdio: 'inherit'
    });
  }

  // Apply all the actions into the hasura engine
  public async reapplyActions(): Promise<void> {
    // scan for actions plugins
    console.log('\n> Scanning for actions plugins...');
    await this.scanActions();

    // drop all actions from hasura engine
    console.log('> Dropping all actions from hasura engine...');
    await this.dropActions();

    // create all custom types for actions into hasura engine
    console.log('> Creating all custom types for actions into hasura engine...');
    await this.createCustomTypes();

    // create all actions plugins into hasura engine
    console.log('> Registering actions plugins into hasura engine...');
    await this.createActions();

    // create all action permissions into hasura engine
    console.log('> Registering actions plugins into hasura engine...');
    await this.createActionPermissions();
  }

  // Re-apply all the events into the hasura engine
  public async reapplyEvents(): Promise<void> {
    await this.events.scanEvents();

    console.log('> Dropping & Registering all events from hasura engine...');

    const events: any = await this.events.getEventsByType('database');
    for await (const table of Object.keys(events)) {
      await this.metadata.dropEvent(table, events[table]);
      await this.metadata.createEvent(table, events[table]);
    }
  }

  // Applies all the track json files into the hasura engine
  public async applyTracks(): Promise<string> {
    console.log('> Scanning tracks directory...');

    const backendInstancePath: string = getConfig('backendInstancePath');

    // Check if the auth instance path exists
    const authInstancePath: string = getConfig('authInstancePath');
    if (!authInstancePath || authInstancePath === '') {
      return Promise.resolve('No auth instance path found');
    }

    // Check if tracks directory exist in the auth instance
    const tracksPath = join(
      process.cwd(), backendInstancePath, 'functions', this.pluginName, 'tracks'
    );
    if (!fileExists(tracksPath)) {
      console.log('> Nothing to track into hasura engine...');
      return Promise.resolve('No tracks folder found. Skipping...');
    }

    console.log('> Applying all tracks into hasura engine...');

    // Scan & read all the json files in the tracks folder
    const dirents = await readdir(tracksPath, {withFileTypes: true});
    for await (const dirent of dirents) {
      if (dirent.isFile() && extname(dirent.name).toLowerCase() === '.json') {
        const trackPath: string = join(tracksPath, dirent.name);

        try {
          const track: Buffer = await readFile(trackPath);
          const trackJSON: any = JSON.parse(track.toString());

          await this.metadata.tracks(trackJSON);
        } catch (error) {
          continue;
        }
      }
    }
  }

  // Scan all the actions files and prepares the actions array
  private async scanActions(): Promise<void>  {
    for await (const plugin of this.actionPlugins) {
      // Check if the plugin path exists
      let exist = await fileExists(`${plugin.path}/actions`);
      if (!exist) {
        console.log(`> Action Instance ${plugin.instance} is missing. Skipping...`);
        continue;
      }
      const dirents = await readdir(`${plugin.path}/actions`, {withFileTypes: true});
      for await (const dirent of dirents) {
        if (dirent.isDirectory()) {
            // Check if the action.graphql file exists
            exist = await fileExists(join(plugin.path, "actions", dirent.name, this.actionGQLFile));
            if (!exist) {
              console.log(`> Action Instance ${plugin.instance} does not have actions.graphql file. Skipping...`);
              continue;
            }
      
            // Push the action to the actions array
            this.actions.push({
              name: removeSpecialChars(dirent.name),
              handler: removeSpecialChars(plugin.instance),
              path: join(plugin.path, "actions", dirent.name),
              grapqhl_path: join(plugin.path, "actions", dirent.name, this.actionGQLFile),
              setting_path: join(plugin.path, "actions", dirent.name, this.actionSettingFile)
            });
          }
        }
      }
  }

  // Drops all actions from the hasura engine
  private async dropActions(): Promise<void | boolean> {
    if (this.actions.length <= 0) {
      return Promise.resolve(false);
    }

    for await (const action of this.actions) {
      await this.metadata.dropAction(action.name);
    }
  }

  // Create all actions into the hasura engine
  private async createActions(): Promise<void | boolean> {
    if (this.actions.length <= 0) {
      return Promise.resolve(false);
    }

    for await (const action of this.actions) {
      await this.metadata.createAction(action);
    }
  }

  // Create all actions into the hasura engine
  private async createActionPermissions(): Promise<void | boolean> {
    if (this.actions.length <= 0) {
      return Promise.resolve(false);
    }

    for await (const action of this.actions) {
      await this.metadata.createActionPermission(action);
    }
  }

  // Create all custom types into the hasura engine
  private async createCustomTypes(): Promise<void | boolean> {
    if (this.actions.length <= 0) {
      return Promise.resolve(false);
    }

    await this.metadata.createCustomTypes(this.actions);
  }
}
