import { execute } from "../helpers/spawn";
import { getConfig } from "./GluestackConfig";

export default class GluestackRouter {
  pluginName: string = '';
  instancePath: string = '';

  constructor() {
    this.pluginName = getConfig('routerPluginName');
    this.instancePath = getConfig('routerInstancePath');
  }

  async listEndpoints() {
    if (this.pluginName !== '' || this.instancePath !== '') {
      await execute('node', ['glue', 'route:endpoints'], { cwd: process.cwd(), stdio: 'inherit' });
    }
  }

  async listRoutes() {
    if (this.pluginName !== '' || this.instancePath !== '') {
      await execute('node', ['glue', 'route:list'], { cwd: process.cwd(), stdio: 'inherit' });
    }
  }
}
