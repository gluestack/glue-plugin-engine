import { GlueStackPlugin } from "src";
import GluestackEngine from "../core/GluestackEngine";
import { IGlueEngine } from "../core/types/IGlueEngine";
import IApp from "@gluestack/framework/types/app/interface/IApp";

export function developUpdate(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("develop:update")
    .description(
      "Updates the project & docker composition with the latest changes of GraphQL instance and addition of new instance.",
    )
    .action(() => runner(glueStackPlugin));
}

export async function runner(
  glueStackPlugin: GlueStackPlugin,
) {
  const app: IApp = glueStackPlugin.app;
  try {
    const engine: IGlueEngine = new GluestackEngine(app, 'backend');
    await engine.update();
  } catch (err) {
    console.log('>> err', err);
  }
}
