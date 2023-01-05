const axios = require("axios").default;

import { join } from 'path';
import * as dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { IAction } from '../core/types/IHasuraEngine';
import { generateActionCustomTypes } from '../helpers/generate-action-custom-types';

export default class HasuraMetadata {
  private hasuraEnvs: any;
  private pluginName: string;
  private backendInstancePath: string

  constructor(backendInstancePath: string, pluginName: any) {
    this.pluginName = pluginName;
    this.backendInstancePath = backendInstancePath;

    this.hasuraEnvs = this.captureEnvVars();
  }

  // Drops the given action from the hasura engine
  public async dropAction(actionName: string): Promise<void> {
    const data = {
      "type": "drop_action",
        "args":{
          "name": actionName,
          "clear_data": true
      }
    };

    await this.makeRequest(data);
  }

  // Creates the given custom-types & action in the hasura engine
  public async createActionCustomTypes(action: IAction): Promise<string> {
    // Reads the action.setting file
    const setting = readFileSync(action.setting_path, 'utf8');

    const regex = /execution="(.*)"/g;
    const match = regex.exec(setting);

    const kind = match[1] === 'sync' ? 'synchronous' : 'asynchronous';

    // Reads the action.graphql file
    const schema = readFileSync(action.grapqhl_path, 'utf8');

    let payloads: any = {};

    try {
      // Generates the custom types & action data
      payloads = generateActionCustomTypes(schema, kind);
    } catch (error) {
      console.log(`> Action Instance ${action.name} has invalid graphql schema. Skipping...`);
      return Promise.resolve('failed');
    }

    console.log(`\n> Creating action ${action.name}...`);
    console.log(`> Creating custom types for action ${action.name}...`);

    // creating custom types
    await this.makeRequest(payloads.customTypesData);

    // creating action
    await this.makeRequest(payloads.actionData);
  }

  // Capture the hasura envs from the .env file
  private captureEnvVars(): any {
    const envPath = join(
      process.cwd(), this.backendInstancePath, 'functions', this.pluginName, '.env'
    );

    return dotenv.config({ path: envPath }).parsed;
  }

  // Make a request to the hasura engine with the available env vars
  private async makeRequest(data: any, terminateOnError: boolean = false): Promise<void> {
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
      if (error.response.data.error) {
        console.log('>', error.response.data.error);
      }
    }
  }
}