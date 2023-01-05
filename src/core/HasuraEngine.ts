import { join } from "path";

import { execute } from "../helpers/spawn";
import { fileExists } from "../helpers/file-exists";
import { removeSpecialChars } from "../helpers/remove-special-chars";

import { IAction } from "./types/IHasuraEngine";
import { IStatelessPlugin } from "./types/IStatelessPlugin";
import HasuraMetadata from "./HasuraMetadata";

export default class HasuraEngine {
  public pluginName: string;
  public backendInstancePath: string;
  public actionPlugins: IStatelessPlugin[];

  private metadata: any;
  private actions: IAction[];
  private actionGQLFile: string = 'action.graphql';
  private actionSettingFile: string = 'action.setting';

  constructor(
    backendInstancePath: string, pluginName: string, actionPlugins: IStatelessPlugin[]
  ) {
    this.actions = [];
    this.pluginName = pluginName;
    this.actionPlugins = actionPlugins;
    this.backendInstancePath = backendInstancePath;

    this.metadata = new HasuraMetadata(this.backendInstancePath, this.pluginName);
  }

  // Scan all the actions files and prepares the actions array
  public async scanActions(): Promise<void>  {
    for await (const plugin of this.actionPlugins) {
      // Check if the plugin path exists
      let exist = await fileExists(plugin.path);
      if (!exist) {
        console.log(`> Action Instance ${plugin.instance} is missing. Skipping...`);
        continue;
      }

      // Check if the action.graphql file exists
      exist = await fileExists(join(plugin.path, this.actionGQLFile));
      if (!exist) {
        console.log(`> Action Instance ${plugin.instance} does not have actions.graphql file. Skipping...`);
        continue;
      }

      // Push the action to the actions array
      this.actions.push({
        name: removeSpecialChars(plugin.instance),
        path: plugin.path,
        grapqhl_path: join(plugin.path, this.actionGQLFile),
        setting_path: join(plugin.path, this.actionSettingFile)
      });
    }
  }

  // Drops all actions from the hasura engine
  public async dropActions(): Promise<void | boolean> {
    if (this.actions.length <= 0) {
      return Promise.resolve(false);
    }

    for await (const action of this.actions) {
      await this.metadata.dropAction(action.name);
    }
  }

  // Create all actions into the hasura engine
  public async createActions(): Promise<void | boolean> {
    if (this.actions.length <= 0) {
      return Promise.resolve(false);
    }

    for await (const action of this.actions) {
      await this.metadata.createActionCustomTypes(action);
    }
  }

  // Sync hasura engine's metadata with the local hasura metadata
  public async applyMetadata(): Promise<void> {
    const filepath = join(process.cwd(), this.backendInstancePath, 'functions', this.pluginName);

    await execute('hasura', [
      'metadata',
      'apply',
      '--skip-update-check'
    ], {
      cwd: filepath,
      stdio: 'inherit'
    });
  }
}
