import { join } from "node:path";

import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { addForwardSlash } from "../helpers/add-forward-slash";

const { fileExists } = require('@gluestack/helpers');
const { ConsoleTable } = require('@gluestack/helpers');

export async function routesList(upInstances: any, isUp: boolean) {
	const head: string[] = ['Plugin Prefix Route', 'URI Route', 'URI Method']
	const rows: any = [];

	for (const instance of upInstances) {
		const paths: string[] = [];

		if (instance && instance?.containerController) {
			try {

				const isService: boolean =
					// @ts-ignore
					instance.callerPlugin.getName() === '@gluestack/glue-plugin-service-node';

				const routerPath: string = join(
					process.cwd(),
					// @ts-ignore
					instance.getInstallationPath(),
					"router.js",
				);

				if (!await fileExists(routerPath)) {
					await runUpCommand(instance, isUp);
					continue;
				}

				const content = require(routerPath)();
				if (!content.length) {
					await runUpCommand(instance, isUp);
					continue;
				}

				for (const data of content) {
					if (data.hasOwnProperty("path") && data.path.includes('(.*)')) {
						paths.push(data.path);
					}

					if (data.hasOwnProperty("path") && !data.path.includes('(.*)')) {
						rows.push([
							data.path,
							data.proxy.path,
							'--'
						]);
					}
				}

				if (typeof instance.containerController.getRoutes !== 'function') {
					await runUpCommand(instance, isUp);
					continue;
				}

				const routes: IRoutes[] = await instance.containerController.getRoutes();
				if (!routes.length) {
					await runUpCommand(instance, isUp);
					continue;
				}

				let pluginData: any;
				const subRoutes: string[] = [];
				const subMethods: string[] = [];
				for (const _path of paths) {

					pluginData = _path.replace('(.*)', '');
					for (const route of routes) {

						const _routePath = addForwardSlash(route.path);
						if (subRoutes.includes(_routePath)) {
							continue;
						}

						subRoutes.push(_routePath);
						if (isService) {
							subMethods.push('ALL');
						} else {
							subMethods.push(route.method);
						}
					}

					rows.push([
						pluginData,
						subRoutes.join("\n"),
						subMethods.join("\n")
					]);
				}


				await runUpCommand(instance, isUp);

			} catch (e) {
				console.log(
					`Failed: ${instance.getName()} instance could not be started`,
				);

				console.log("\x1b[33m\nError:\x1b[31m", e.message, "\x1b[0m");
			}
		}
	}

	ConsoleTable.print(head, rows);
}

const runUpCommand = async (instance: IPlugin & IHasContainerController, isUp: boolean) => {
	if (isUp) {
		await instance.containerController.getPortNumber();
		await instance.containerController.up();
	}
};