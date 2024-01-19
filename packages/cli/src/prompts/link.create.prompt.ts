import prompts from "prompts";
import { TLinkCreate, slugSchema, urlSchema } from "../models";

export const askCreateLink = async (): Promise<TLinkCreate> => {
	const response = await prompts([
		{
			type: "text",
			name: "slug",
			message: "Type in a custom slug.",
			validate: (value) => {
				const validatedValue = slugSchema.safeParse(value);

				if (validatedValue.success) {
					return true;
				} else {
					return validatedValue.error.message;
				}
			},
		},
		{
			type: "text",
			name: "destination",
			message: "Type in a destination url.",
			validate: (value) => {
				const validatedValue = urlSchema.safeParse(value);

				if (validatedValue.success) {
					return true;
				} else {
					return validatedValue.error.message;
				}
			},
		},
	]);

	return response;
};
