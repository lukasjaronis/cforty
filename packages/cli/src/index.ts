#!/usr/bin/env node
import { Command } from "commander";
import { askInit } from "./prompts/init.prompt";
import { config } from "./utils/config";
import { getPackageInfo } from "./utils/getPackageInfo";
import { linkCreate } from "./commands/link.create";
import { linkAnalytics } from "./commands/link.analytics";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
	const packageInfo = await getPackageInfo();

	const exists = config().exists();

	if (!exists) {
		const response = await askInit();
		config().create(response);
	}

	const program = new Command()
		.name("cforty")
		.description("create short links in your terminal")
		.version(packageInfo.version || "1.0.0", "-v, --version", "display the version number");

	program.addCommand(linkCreate).addCommand(linkAnalytics);

	program.parse();
}

main();
