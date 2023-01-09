import { join } from 'path';
import { readdir } from 'node:fs/promises';
import { fileExists } from '../helpers/file-exists';

export default class GluestackEvent {
  public events: any = {};
  public eventsPath: string;
  public hasuraPluginName: string;
  public backendInstancePath: string;

  constructor(backendInstancePath: string, hasuraPluginName: string) {
    this.events = {};
    this.backendInstancePath = backendInstancePath;
    this.hasuraPluginName = hasuraPluginName;
    this.eventsPath = join(this.backendInstancePath, 'events');
  }

  // Scans the events directory and prepares the events object
  public async scanEvents() {
    this.events['database'] = await this.readEventsDir('database', true);
    this.events['app'] = await this.readEventsDir('app', false);
  }

  // Reads the events directory and returns the events
  private async readEventsDir(
    dirName: string, scanDirectory: boolean
  ): Promise<string[]> {
    const paths: any = [];
    const dirPath = join(this.eventsPath, dirName);

    const exist = await fileExists(dirPath);
    if (!exist) {
      console.log(`> "${dirName}" directory does not exist in "events" directory. Skipping...`);
      return;
    }

    const dirents = await readdir(dirPath, {
      withFileTypes: true
    });

    for await (const dirent of dirents) {
      // Skip if the dirent is a directory and scanDirectory is false
      // Skip if the dirent is a file and scanDirectory is false
      if (
        (scanDirectory && !dirent.isDirectory())
        || (!scanDirectory && dirent.isDirectory())
      ) {
        continue;
      }

      // Skip if the dirent is a file and scanDirectory is true
      if (scanDirectory) {
        paths[dirent.name] = await this.readEventsDir(
          join(dirName, dirent.name), false
        );
      }

      // Skip if the dirent is a directory and scanDirectory is true
      if (!scanDirectory) {
        paths.push(dirent.name);
      }
    }

    return paths;
  }

  // Applies all the events to the hasura engine
  public async getEventsByType(type: string): Promise<any> {
    return this.events[type];
  }
}
