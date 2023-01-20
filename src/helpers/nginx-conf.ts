import { join, relative } from 'path';
import { writeFileSync } from 'fs';
import { fileExists } from './file-exists';
import { server_domain } from '../constants';
import {
  endsWith, startsWith, setServer, setLocation
} from './nginx-literals';

/**
 * Nginx Conf
 *
 * This class is responsible for generating the nginx.conf file
 * in your backend instance's engine/router folder.
 */
export default class NginxConf {
  public upstreams: any[];

  constructor() {
    this.upstreams = [];
  }

  // Generates the nginx.conf file
  public async generate(): Promise<void> {
    try {
      const conf: string = await this.toConf();
      const filepath: string = join(process.cwd(), 'nginx.conf');

      writeFileSync(filepath, conf);

      console.log('> NGINX file created successfully -', relative('.', filepath));
    } catch (err) {
      console.log('> NGINX file creation failed due to following reasons -');
      console.log(err);
    }
  }

  // Adds router.js data to the nginx conf data
  // if and only if the given path exists
  public async addRouter(port: number, string: string): Promise<boolean> {
    const upstreams: any[] = this.upstreams;

    const exist = await fileExists(string);
    if (!exist) return Promise.resolve(false);

    upstreams.push({locations: [...require(string)()], port});

    return Promise.resolve(true);
  }

  // Converts the nginx conf data to a string
  private async toConf(): Promise<string> {
    let locations: string[] = [];
    let domain: string = '';

    const upstreams: any[] = this.upstreams;

    for await (const upstream of upstreams) {
      for await (const location of upstream.locations) {
        if (location.hasOwnProperty('server_name')) {
          domain = location.server_name + server_domain;
        }

        if (location.hasOwnProperty('path')) {
          locations.push(setLocation(
            location.path, `localhost:${upstream.port}`, location.proxy.path, location.host, location.size_in_mb || 50
          ));
        }
      }
    }

    return Promise.resolve(
      startsWith + setServer(domain, locations) + endsWith
    );
  }
}
