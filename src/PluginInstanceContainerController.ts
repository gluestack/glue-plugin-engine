import colors from "colors";
import { join } from "path";
import * as dotenv from "dotenv";

import { execute } from "./helpers/spawn";
import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";

import { DockerodeHelper, ConsoleTable } from "@gluestack/helpers";

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: PluginInstance;
  appPorts: number[] = [];

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
    const { appPorts } = this;

    const data: any = {};
    data.Image = "nginx:latest";
    data.RestartPolicy = {
      Name: "always"
    };

    data.ExposedPorts = {};
    data.HostConfig = {
      PortBindings: {}
    };

    appPorts.forEach((port: number) => {
      data.ExposedPorts[`${port}/tcp`] = {};

      data.HostConfig.PortBindings[`${port}/tcp`] = [];
      data.HostConfig.PortBindings[`${port}/tcp`].push({ HostPort: `${port}` });
    });

    data.HostConfig.Binds = [
      `${await this.getDefaultConfPath()}:/etc/nginx/nginx.conf`
    ];

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

  getConfig(): any { }

  async up() {
    // shutdown if already up
    if (this.getStatus() === "up") {
      await this.down();
    }

    // generate/refresh routes before starting
    const response = await this.routeGenerate();
    if (response.length <= 0) {
      throw new Error("No routes found");
    }

    console.log(colors.cyan('\n> Generating Domain Mapping...'));
    await this.consoleTable(response);

    response.forEach((route: any) => {
      if (route.port) {
        this.appPorts.push(route.port);
      }
    });

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
    //
  }

  async watch(): Promise<string[]> {
    return [];
  }

  async build() {
    await this.routeGenerate(true);
    // await this.envGenerate(true);
  }

  private async routeGenerate(isProd: boolean = false) {
    let args: string[] = [
      'glue',
      'route:generate'
    ];

    if (isProd) {
      args.push('--build');
      args.push('prod');
    }

    const response = await execute('node', args, {
      cwd: process.cwd(),
      shell: true,
    });

    try {
      // @ts-ignore
      return JSON.parse(response);
    } catch (err) {
      return [];
    }
  }

  private async envGenerate(isProd: boolean = false) {
    let args: string[] = [
      'glue',
      'env:generate'
    ];

    if (isProd) {
      args.push('--build');
      args.push('prod');
    }

    await execute('node', args, {
      cwd: process.cwd(),
      shell: true,
    });
  }

  private async consoleTable(mappings: any) {
    let i: number = 1;
    const rows: any = [];
    const head: string[] = [
      '#',
      'Domains',
      'Server Names',
    ]

    for await (const mapping of mappings) {
      rows.push([
        colors.yellow(`${i++}`),
        colors.yellow(`http://localhost:${mapping.port}`),
        colors.yellow(`http://${mapping.domain}:${mapping.port}`)
      ]);
    }

    ConsoleTable.print(
      head,
      rows
    );
  }
}
