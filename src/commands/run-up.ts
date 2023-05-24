import { GlueStackPlugin } from "src";
import GluestackEngine from "../core/GluestackEngine";
import { IGlueEngine } from "../core/types/IGlueEngine";
import IApp from "@gluestack/framework/types/app/interface/IApp";

export function runUp(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("run:up")
    .option("--no-cache", "build docker with --no-cache")
    .description("Starts all the containers for the project.")
    .action((args: any) => runner(glueStackPlugin, args));
}

export async function runner(
  glueStackPlugin: GlueStackPlugin,
  args: any
) {
  const app: IApp = glueStackPlugin.app;
  try {
    const noCache = args.cache === false ? true : false;
    const engine: IGlueEngine = new GluestackEngine(app, 'backend');
    await engine.start(true, noCache);
  } catch (err) {
    console.log('>> err', err);
  }
}
