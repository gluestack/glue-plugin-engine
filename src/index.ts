//@ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";

import { build } from "./commands/build";
import { developUp } from "./commands/develop-up";
import { developDown } from "./commands/develop-down";
import { developList } from "./commands/develop-list";
import { developWatch } from "./commands/develop-watch";
import { developUpdate } from "./commands/develop-update";
import { runUp } from "./commands/run-up";
import { runDown } from "./commands/run-down";
import { envGenerate } from "./commands/env-generate";


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
    this.app.addCommand((program: any) => developUpdate(program, this));
    this.app.addCommand((program: any) => developWatch(program, this));
    this.app.addCommand((program: any) => runUp(program, this));
    this.app.addCommand((program: any) => runDown(program, this));
    this.app.addCommand((program: any) => build(program, this));
    this.app.addCommand((program: any) => envGenerate(program, this));
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

  getInstallationPath(): string {
    return process.cwd();
  }

  async runPostInstall(instanceName: string, target: string) {
    const instance: GlueStackPlugin = this.app.getPluginByName(
      "@gluestack/glue-plugin-engine",
    );
    // Validation
    if (
      instance && instance.getInstances() && instance.getInstances()[0]
    ) {
      throw new Error(
        `Engine instance already installed as ${instance
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
