import { GlueStackPlugin } from "src";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { routesList } from "../helpers/route-list";

export const routeList = async (program: any, glueStackPlugin: GlueStackPlugin) => {
	program
		.command("route:list")
		.description("Generate route list of all instances")
		.action((instanceName: string) => runner(instanceName, glueStackPlugin));
};

export async function runner(
	instanceName: string,
	glueStackPlugin: GlueStackPlugin,
) {
	const instances = glueStackPlugin.app.getContainerTypePluginInstances(true);
	let upInstances: (IPlugin & IHasContainerController)[] = instances;
	if (instanceName) {
		for (const instance of instances) {
			if (instance.getName() === instanceName) {
				upInstances = [instance];
				break;
			}
		}
	}

	await routesList(upInstances, false);
}