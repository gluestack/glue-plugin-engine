import { GlueStackPlugin } from "src";
import fs from "fs";
import path from "path";
const { MultiSelect, confirm } = require("enquirer");

export function eventRemove(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("events:remove")
		.option("--app", "list all app events to delete")
		.option("--database", "list all database events to delete")
		.description("List the events with select option to delete selected events")
		.action((args: any) => deleteEvents(glueStackPlugin, args));
}

export async function deleteEvents(
	_glueStackPlugin: GlueStackPlugin,
	args: any
) {
	const eventTypes: any = {
		app: "./backend/events/app",
		database: "./backend/events/database",
	};

	const selectedEventTypes = Object.keys(args).filter((key) =>
		eventTypes.hasOwnProperty(key)
	);

	if (selectedEventTypes.length === 0) {
		console.log(
			"please give at least one event type for eg:\nnode glue events:delete --app or --database "
		);
		return;
	}

	for await (const eventType of selectedEventTypes) {
		const files = fs.readdirSync(eventTypes[eventType]);
		await deleteSelected(files, eventTypes[eventType]);
	}
}

const deleteSelected = async (files: string[], eventPath: string) => {
	const choices = files.map((file, index) => {
		return { name: file, value: index };
	});

	if (choices.length === 0) {
		console.log("No events found to delete.");
		process.exit(0);
	}

	const prompted = new MultiSelect({
		name: "files",
		message:
			"Select the files and directories you want to delete by pressing <space>:",
		choices,
	});
	const selectedIndexes = await prompted.run();

	if (selectedIndexes.length === 0) {
		process.exit(0);
	}

	const userConfirm = await confirm({
		name: "question",
		message: "Are you sure you want to delete the selected files and folders?",
	});

	if (!userConfirm) {
		process.exit(0);
	}

	for (const index of selectedIndexes) {
		const filePath = path.join(eventPath, index);
		const stats = await fs.promises.lstat(filePath);
		if (stats.isDirectory()) {
			await fs.promises.rm(filePath, { recursive: true });
		} else {
			await fs.promises.unlink(filePath);
		}
		console.log(`Deleted ${index} event`);
	}
};

module.exports = { eventRemove };
