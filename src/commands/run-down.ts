import { GlueStackPlugin } from "src";
import GluestackEngine from "../core/GluestackEngine";
import { IGlueEngine } from "../core/types/IGlueEngine";
import IApp from "@gluestack/framework/types/app/interface/IApp";

export function runDown(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("run:down")
    .description("Stops all the project containers")
    .action(() => runner(glueStackPlugin));
}

export async function runner(glueStackPlugin: GlueStackPlugin) {
  const app: IApp = glueStackPlugin.app;
  try {
    const engine: IGlueEngine = new GluestackEngine(app, "backend");
    await engine.stop(true);
  } catch (err) {
    console.log(">> err", err);
  }
}
