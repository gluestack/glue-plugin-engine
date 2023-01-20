const axios = require("axios").default;

import { join } from 'path';
import * as dotenv from 'dotenv';
import { readFileSync } from 'node:fs';

import { IAction } from '../core/types/IHasuraEngine';
import { IHasuraMetadata } from './types/IHasuraMetadata';

import { getConfig, setConfig } from './GluestackConfig';
import { generate as generateEvent } from '../helpers/generate-events';
import { generate as generateActionOrCustomType } from '../helpers/generate-action-custom-types';
import { generateActionPermission } from '../helpers/generate-action-custom-types';

/**
 * HasuraMetadata
 *
 * This class is responsible for generating the hasura metadata
 * and uses the hasura engine to create the actions, custom-types
 * and events.
 */
export default class HasuraMetadata implements IHasuraMetadata {
  public hasuraEnvs: any;
  private pluginName: string;

  constructor(pluginName: any) {
    this.pluginName = pluginName;
    this.hasuraEnvs = this.captureEnvVars();

    setConfig('hasuraEnvs', this.hasuraEnvs);
  }

  // Drops the given action from the hasura engine
  public async dropAction(actionName: string): Promise<void> {
    const data = {
      "type": "drop_action",
      "args": {
        "name": actionName,
        "clear_data": true
      }
    };

    await this.makeRequest(data);
  }

  // Creates the given action in the hasura engine
  public async createAction(action: IAction): Promise<string> {
    // Reads the action.setting file
    const setting = readFileSync(action.setting_path, 'utf8');

    const regex = /execution="(.*)"/g;
    const match = regex.exec(setting);

    const kind = match[1] === 'sync' ? 'synchronous' : 'asynchronous';

    // Reads the action.graphql file
    const schema = readFileSync(action.grapqhl_path, 'utf8');

    let actionData: any = {};

    try {
      // Generates the custom types & action data
      actionData = await generateActionOrCustomType(schema, kind, 'action', action);
    } catch (error) {
      console.log(`> Action Instance ${action.name} has invalid graphql schema. Skipping...`);
      return Promise.resolve('failed');
    }

    // creating action
    await this.makeRequest(actionData, true);
  }

  // Creates the given action in the hasura engine
  public async createActionPermission(action: IAction): Promise<string> {
    // Reads the action.setting file
    const setting = readFileSync(action.setting_path, 'utf8');

    const regex = /roles="(.*)"/g;
    const match = regex.exec(setting);
    if (match?.[1]) {
      const roles = match[1].split(",")

      // Reads the action.graphql file
      const schema = readFileSync(action.grapqhl_path, 'utf8');

      let actionData: any = {};

      try {
        // Generates the custom types & action data
        actionData = await generateActionPermission(schema, roles);
      } catch (error) {
        console.log(`> Action Instance ${action.name} has invalid graphql schema. Skipping...`);
        return Promise.resolve('failed');
      }

      // creating action
      await this.makeRequest(actionData, true);
    }
  }

  // Creates the given custom-types against all the actions in the hasura engine
  public async createCustomTypes(actions: IAction[]): Promise<void> {
    const customTypes: any = {
      type: 'set_custom_types',
      args: {
        scalars: [],
        enums: [],
        objects: [],
        input_objects: []
      }
    };

    // prepares custom types for actions
    for await (const action of actions) {
      // Reads the action.setting file
      const setting = readFileSync(action.setting_path, 'utf8');

      const regex = /execution="(.*)"/g;
      const match = regex.exec(setting);

      const kind = match[1] === 'sync' ? 'synchronous' : 'asynchronous';

      // Reads the action.graphql file
      const schema: string = readFileSync(action.grapqhl_path, 'utf8');

      try {
        // Generates the custom types & action data
        const _tmp: any = await generateActionOrCustomType(schema, kind, 'custom_types');

        customTypes.type = _tmp.type;
        customTypes.args.scalars = [...customTypes.args.scalars, ..._tmp.args.scalars];
        customTypes.args.enums = [...customTypes.args.enums, ..._tmp.args.enums];
        customTypes.args.objects = [...customTypes.args.objects, ..._tmp.args.objects];
        customTypes.args.input_objects = [...customTypes.args.input_objects, ..._tmp.args.input_objects];

      } catch (error) {
        console.log(`> Action Instance ${action.name} has invalid graphql schema. Skipping...`);
        continue;
      }

    }

    // creating action
    await this.makeRequest(customTypes, true);
  }

  // Creates the given event in the hasura engine
  public async createEvent(tableName: string, events: string[]): Promise<void> {
    const hasuraEnvs: any = this.hasuraEnvs;
    const { HASURA_GRAPHQL_DB_NAME } = hasuraEnvs;

    const payload: any = await generateEvent(tableName, HASURA_GRAPHQL_DB_NAME, events);

    // creating event
    await this.makeRequest(payload, true);
  }

  // Drops the given event from the hasura engine
  public async dropEvent(tableName: string, events: string[]): Promise<void> {
    const hasuraEnvs: any = this.hasuraEnvs;
    const { HASURA_GRAPHQL_DB_NAME } = hasuraEnvs;

    const payload: any = {
      type: 'pg_delete_event_trigger',
      args: {
        name: `${tableName}_trigger`,
        source: HASURA_GRAPHQL_DB_NAME
      }
    };

    // creating event
    await this.makeRequest(payload);
  }

  // Tracks array of json objects into hasura engine
  public async tracks(data: any): Promise<void> {
    await this.makeRequest(data);
  }

  // Make a request to the hasura engine with the available env vars
  private async makeRequest(
    data: any, showError: boolean = false
  ): Promise<void> {
    const hasuraEnvs: any = this.hasuraEnvs;

    const options = {
      method: 'POST',
      url: `${hasuraEnvs.HASURA_GRAPHQL_URL}/v1/metadata`,
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-role': 'admin',
        'x-hasura-admin-secret': hasuraEnvs.HASURA_GRAPHQL_ADMIN_SECRET
      },
      data: data
    };

    try {
      await axios.request(options);
    } catch (error) {
      if (showError && error.response && error.response.data.error) {
        console.log('> Error:', error.response.data.error);
      }
    }
  }

  // Capture the hasura envs from the .env file
  private captureEnvVars(): any {
    const envPath = join(
      process.cwd(), getConfig('backendInstancePath'), 'functions', this.pluginName, '.env'
    );

    return dotenv.config({ path: envPath }).parsed;
  }
}