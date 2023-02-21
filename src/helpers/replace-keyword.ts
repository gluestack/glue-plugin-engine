import { readFileSync } from "node:fs";

// Replaces file"s content with the given database name
export const replaceKeyword = async (filePath: string, value: string, key = "{APP_ID}") => {
	let data = readFileSync(filePath, "utf8");
	data = data.toString();

	// @ts-ignore
	data = data.replaceAll(key, value);

	return Promise.resolve(data);
}

export default replaceKeyword;
