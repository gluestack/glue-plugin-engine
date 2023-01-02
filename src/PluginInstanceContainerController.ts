import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
const { DockerodeHelper } = require("@gluestack/helpers");
import GluestackEngine from "./core/GluestackEngine";
import { IGlueEngine } from "./core/types/IGlueEngine";

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: PluginInstance;

  constructor(app: IApp, callerInstance: PluginInstance) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  getCallerInstance(): PluginInstance {
    return this.callerInstance;
  }

  installScript() {
    return ["npm", "install"];
  }

  runScript() {
    // do nothing
  }

  async getEnv() {
    return {
      APP_PORT: await this.getPortNumber(),
    };
  }

  getDockerJson() {
    return {};
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  // @ts-ignore
  async getPortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      let ports =
        this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
      DockerodeHelper.getPort(4499, ports)
        .then((port: number) => {
          this.setPortNumber(port);
          ports.push(port);
          this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
          return resolve(this.portNumber);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getContainerId(): string {
    return this.containerId;
  }

  setStatus(status: "up" | "down") {
    this.callerInstance.gluePluginStore.set("status", status || "down");
    this.status = status || "down";

    return this.status;
  }

  setPortNumber(portNumber: number) {
    this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    this.portNumber = portNumber || null

    return this.portNumber;
  }

  setContainerId(containerId: string) {
    // do nothing
  }

  getConfig(): any {}

  async up() {
    console.log("---- Initiating Engine UP ----");

    const engine: IGlueEngine = new GluestackEngine(this.app);

    // 1. get all the stateless instances
    // 2. collect dockerfile from all available
    // stateles instances assets directory
    await engine.collectDockerContext();

    // 3. generate docker-compose file
    await engine.createDockerCompose('backend');

    // 4. generate nginx config
    await engine.createNginxConfig('backend');

    console.log("---- Exiting Engine UP ----");
  }

  async down() {
    // do nothing
  }

  async build() {
    // do nothing
  }

}