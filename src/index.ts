//@ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";

import { routeGenerate } from "./commands/route-generate";
import { developList } from "./commands/develop-list";
import { developWatch } from "./commands/develop-watch";
import { developUp } from "./commands/develop-up";
import { developDown } from "./commands/develop-down";
import { build } from "./commands/build";

//Do not edit the name of this class
export class GlueStackPlugin implements IPlugin, IManagesInstances, ILifeCycle {
  app: IApp;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "stateless";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: IApp, gluePluginStore: IGlueStorePlugin) {
    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    this.app.addCommand((program: any) => developList(program, this));
    this.app.addCommand((program: any) => developUp(program, this));
    this.app.addCommand((program: any) => developDown(program, this));
    this.app.addCommand((program: any) => developWatch(program, this));
    this.app.addCommand((program: any) => build(program, this));
    this.app.addCommand((program: any) => routeGenerate(program, this));
  }

  destroy() {
    //
  }

  getName(): string {
    return packageJSON.name;
  }

  getVersion(): string {
    return packageJSON.version;
  }

  getType(): "stateless" | "stateful" | "devonly" {
    return this.type;
  }

  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  getInstallationPath(target: string): string {
    return "";
  }

  async runPostInstall(instanceName: string, target: string) {
    const devProcessManagerPlugin: GlueStackPlugin = this.app.getPluginByName(
      "@gluestack/glue-plugin-dev-process-manager",
    );
    //Validation
    if (
      devProcessManagerPlugin &&
      devProcessManagerPlugin.getInstances() &&
      devProcessManagerPlugin.getInstances()[0]
    ) {
      throw new Error(
        `Dev process manager instance already installed as ${devProcessManagerPlugin
          .getInstances()[0]
          .getName()}`,
      );
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string,
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath,
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }
}
