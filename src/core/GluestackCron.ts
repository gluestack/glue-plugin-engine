const { get } = require('lodash');

import { join } from 'path';
import * as cron from 'node-cron';

import { ICronObject, IGluestackCron } from './types/IGluestackCron';

import { fileExists } from '../helpers/file-exists';
import { getConfig, prepareConfigJSON } from './GluestackConfig';

export default class GluestackCron implements IGluestackCron {
  public collection: ICronObject[];

  private filePath: string = 'crons/crons.json';

  constructor() {
    this.collection = [];
  }

  // collects and validates all the cron object
  public async collect(): Promise<void> {
    const backendInstance: string = getConfig('backendInstancePath');

    const filePath: string = join(process.cwd(), backendInstance, this.filePath);
    if (! await fileExists(filePath)) {
      return;
    }

    try {
      const collection: ICronObject[] = require(filePath);
      await this.validate(collection);
    } catch (error) {
      console.log('> Something went wrong during crons.json file reading. Please check your "crons/crons.json" config file again!');
    }
  }

  // validates the crons
  public async validate(collection: ICronObject[]): Promise<void> {
    for await (const object of collection) {
      const schedule = get(object, 'schedule', '');
      const type = get(object, 'type', '');
      const value = get(object, 'value', '');

      if (
        !schedule || !type || !value
          || !cron.validate(schedule)
      ) {
        console.log('> Found invalid schedule. Skipping...');
        console.log({ ...object });
        continue;
      } else {
        this.collection.push(object);
      }
    }
  }

  // prepares the cron jobs into engine's config.json file
  public async start(): Promise<void> {
    // collect and validate the schedules from crons/crons.json file
    await this.collect();

    // prepares the cron jobs
    await prepareConfigJSON({crons: this.collection});
  }
}
