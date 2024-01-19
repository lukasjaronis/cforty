import prompts from "prompts";
import { TSlug, slugSchema } from "../models";

export const askForAnalytics = async (): Promise<TSlug> => {
	const response = await prompts({
		type: "text",
		name: "slug",
		message: "Type in your slug",
		validate: (value) => {
			const validatedValue = slugSchema.safeParse(value);

			if (validatedValue.success) {
				return true;
			} else {
				return validatedValue.error.message;
			}
		},
	});

	return response.slug;
};
