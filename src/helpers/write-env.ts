import * as fs from "fs";
import { PluginInstance } from "../PluginInstance";

export async function constructEnvFromJson(db: any, hasuraPort: any) {
	const keys: any = {
		SSL_CERTS: './ssl-certs/local.gluestack.app'
	};

	return keys;
}

export async function writeEnv(instance: PluginInstance, db: any) {
	const path = `${instance.getInstallationPath()}/.env`;
	const port = await instance.getContainerController().getPortNumber();

	let env = "";
	const keys: any = await instance.getContainerController().getEnv();
	Object.keys(keys).forEach((key) => {
		env += `${key}="${keys[key]}"
`;
	});

	fs.writeFileSync(path, env);
}