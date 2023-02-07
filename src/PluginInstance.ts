import { IPortNumber } from "./interfaces/IPortNumber";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import { PluginInstanceContainerController } from "./PluginInstanceContainerController";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

export class PluginInstance implements IInstance, ILifeCycle, IHasContainerController {
  app: IApp;
  name: string;
  callerPlugin: IPlugin;
  isOfTypeInstance: boolean = true;
  gluePluginStore: IGlueStorePlugin;
  installationPath: string;
  containerController: PluginInstanceContainerController & IPortNumber;

  constructor(
    app: IApp,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string,
  ) {
    this.app = app;
    this.name = name;
    this.callerPlugin = callerPlugin;
    this.gluePluginStore = gluePluginStore;
    this.installationPath = installationPath;
    this.containerController = new PluginInstanceContainerController(app, this);
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getInstallationPath(): string {
    return this.installationPath;
  }

  getContainerController(): PluginInstanceContainerController & IPortNumber {
    return this.containerController;
  }
}
