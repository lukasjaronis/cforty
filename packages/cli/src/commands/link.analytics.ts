import ora from "ora";
import { Command } from "commander";
import { execa } from "execa";
import { buildCurl } from "../utils/buildCurl";
import { askForAnalytics } from "../prompts/link.analytics.prompt";
import Table from "cli-table3";
import { TAPIResponse, TLink } from "../models";

export const linkAnalytics = new Command()
	.name("analytics")
	.description("retrieve analytics for a slug")
	.action(async (opts) => {
		const spinner = ora();

		const slug = await askForAnalytics();

		spinner.start("Fetching slug...");
		const result = await execa(
			"curl",
			buildCurl({
				method: "GET",
				endpoint: `/api/analytics/${slug}`,
			}),
		);

		const json = JSON.parse(result.stdout) as TAPIResponse<{ link: TLink }>;

		spinner.stop();
		const table = new Table();

		Object.entries(json.data.link as TLink).forEach(([key, value]) =>
			table.push({ [key]: value }),
		);

		console.log(table.toString());
	});
