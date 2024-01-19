import ora from "ora";
import { Command } from "commander";
import { execa } from "execa";
import { askCreateLink } from "../prompts/link.create.prompt";
import { buildCurl } from "../utils/buildCurl";
import { log } from "../utils/log";
import { TAPIResponse, TLinkCreate, slugSchema, urlSchema } from "../models";
import clipboardy from "clipboardy";

export const linkCreate = new Command()
	.name("create")
	.description("create a new short link")
	.action(async (opts) => {
		const spinner = ora();

		const body = await askCreateLink();

		spinner.start("Creating link...");
		const result = await execa(
			"curl",
			buildCurl<TLinkCreate>({
				method: "POST",
				endpoint: "/api/create",
				body,
			}),
		);

		const json = JSON.parse(result.stdout) as TAPIResponse<{ url: string }>;

		spinner.stop();
		clipboardy.writeSync(`${json.data.url}`);
		log.success(`URL: ${json.data.url}`);
		log.info("Copied to clipboard!");
	});
