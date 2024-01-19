import * as zod from "zod";

import prompts from "prompts";
import { urlSchema } from "../models";

export const configSchema = zod.object({
	apiUrl: urlSchema,
	bearer: zod.string(),
});

export type TConfig = zod.infer<typeof configSchema>;

export const askInit = async (): Promise<TConfig> => {
	const response = await prompts([
		{
			type: "text",
			name: "apiUrl",
			message: "Paste in your API url.",
			validate: (value) => {
				const validatedValue = urlSchema.safeParse(value);

				if (validatedValue.success) {
					return true;
				} else {
					return validatedValue.error.message;
				}
			},
		},
		{
			type: "text",
			name: "bearer",
			message: "Paste in your bearer token.",
		},
	]);

	return response;
};
