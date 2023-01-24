import { join } from "path";
import * as dotenv from "dotenv";
import { execute } from "./helpers/spawn";
import { PluginInstance } from "./PluginInstance";
const { DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import { fileExists } from "./helpers/file-exists";

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
    // do nothing
  }

  runScript() {
    // do nothing
  }

  getEnv() {
    return {}
  }

  async getDockerJson() {
    const SSL_FILES_PATH: string = join(
      process.cwd(), await this.getSslFilesPath()
    );

    const data: any = {};
    data.Image = "nginx:latest";
    data.RestartPolicy = {
      Name: "always"
    };

    data.HostConfig = {
      PortBindings: {
        "80/tcp": [{ HostPort: '80' }]
      }
    };

    const filesExist: boolean = await fileExists(SSL_FILES_PATH);
    if (filesExist) {
      data.HostConfig.Binds = [
        `${await this.getDefaultConfPath()}:/etc/nginx/nginx.conf`,
        `${SSL_FILES_PATH}/fullchain.pem:/etc/ssl/fullchain.pem`,
        `${SSL_FILES_PATH}/privkey.pem:/etc/ssl/privkey.pem`
      ];
    }

    data.ExposedPorts = {
      "80/tcp": {},
    };

    return data;
  }

  async getSslFilesPath() {
    const envPath: string = join(
      process.cwd(), '.env'
    );

    const env: any = dotenv.config({ path: envPath }).parsed;
    return env.SSL_CERTS;
  }

  async getDefaultConfPath() {
    return join(process.cwd(), 'meta/router', 'nginx.conf');
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
      const ports = this.callerInstance
        .callerPlugin
        .gluePluginStore
        .get("ports") || [];

      DockerodeHelper.getPort(1337, ports)
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
    // shutdown if already up
    if (this.getStatus() === "up") {
      await this.down();
    }

    // generate/refresh routes before starting
    await this.routeGenerate();

    // start
    await new Promise(async (resolve, reject) => {
      DockerodeHelper.up(
        await this.getDockerJson(),
        this.getEnv(),
        this.portNumber,
        this.callerInstance.getName(),
      )
        .then(
          async ({
            status,
            containerId,
          }: {
            status: "up" | "down";
            containerId: string;
          }) => {
            this.setStatus(status);
            this.setContainerId(containerId);
            return resolve(true);
          },
        )
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async down() {
    await new Promise(async (resolve, reject) => {
      DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
        .then(() => {
          this.setStatus("down");
          this.setContainerId(null);
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async watch(): Promise<string[]> {
    return [];
  }

  async build() {
    // do nothing
  }

  private async routeGenerate() {
    await execute('node', [
      'glue',
      'route:generate'
    ], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
  }
}
