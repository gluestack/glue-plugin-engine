import { join } from 'path';
import { writeFileSync } from 'fs';
import { fileExists } from '../helpers/file-exists';
import {
  endsWith, startsWith, setServer, setLocation
} from '../helpers/nginx-literals';

import { getConfig } from './GluestackConfig';

/**
 * Nginx Conf
 *
 * This class is responsible for generating the nginx.conf file
 * in your backend instance's engine/router folder.
 */
export default class NginxConf {
  public data: any[];

  constructor() {
    this.data = [];
  }

  // Generates the nginx.conf file
  public async generate(): Promise<void> {
    try {
      const conf: string = await this.toConf();

      writeFileSync(
        join(
          process.cwd(),
          getConfig('backendInstancePath'),
          'engine/router',
          'nginx.conf'
        ),
        conf
      );

    } catch (err) {
      console.log(err);
    }
  }

  // Adds router.js data to the nginx conf data
  // if and only if the given path exists
  public async addRouter(string: string): Promise<boolean> {
    const data: any[] = this.data;

    const exist = await fileExists(string);
    if (!exist) return Promise.resolve(false);

    data.push(...require(string)());

    return Promise.resolve(true);
  }

  // Converts the nginx conf data to a string
  private async toConf(): Promise<string> {
    let locations: string[] = [];
    let domain: string = '';

    const data: any[] = this.data;

    data.forEach((routes: any) => {
      if (routes.hasOwnProperty('domain')) {
        domain = routes.domain;
      }

      if (routes.hasOwnProperty('path')) {
        locations.push(setLocation(
          routes.path, routes.proxy.instance, routes.proxy.path
        ));
      }
    });

    return Promise.resolve(
      startsWith + setServer(domain, locations) + endsWith
    );
  }
}
