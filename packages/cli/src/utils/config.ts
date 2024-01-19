import path from "path";
import fs from "fs-extra";
import os from "os";
import { TConfig } from "../prompts/init.prompt";

export const config = () => {
	const dir = path.resolve(os.homedir(), ".cforty");

	return {
		exists: () => fs.existsSync(dir),
		create: (data: TConfig) => fs.writeFileSync(dir, JSON.stringify(data)),
		get: (): TConfig => {
			const json = JSON.parse(fs.readFileSync(dir, "utf8")) as TConfig;

			return json;
		},
	};
};
