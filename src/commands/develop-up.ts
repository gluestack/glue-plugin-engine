import { GlueStackPlugin } from "src";
import GluestackEngine from "../core/GluestackEngine";
import { IGlueEngine } from "../core/types/IGlueEngine";
import IApp from "@gluestack/framework/types/app/interface/IApp";

export function developUp(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("develop:up")
    .description(
      "Starts all the containers for the project.",
    )
    .action(() => runner(glueStackPlugin));
}

export async function runner(
  glueStackPlugin: GlueStackPlugin,
) {
  const app: IApp = glueStackPlugin.app;
  try {
    const engine: IGlueEngine = new GluestackEngine(app, 'backend');
    await engine.start();
  } catch (err) {
    console.log('>> err', err);
  }
}
