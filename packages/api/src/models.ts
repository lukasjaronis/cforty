import { z } from "zod";

export const urlSchema = z.string().url({ message: "Must be a valid URL!" });
export const slugSchema = z.string().min(1, { message: "Slug must be at least 1 character!" });

export const linkSchema = z.object({
	id: z.number(),
	slug: slugSchema,
	slugUrl: urlSchema,
	destination: urlSchema,
	clicks: z.number(),
});

export const linkCreateSchema = linkSchema.omit({
	id: true,
	slugUrl: true,
	clicks: true,
});

export type TLink = z.infer<typeof linkSchema>;
export type TLinkCreate = z.infer<typeof linkCreateSchema>;
export type TUrl = z.infer<typeof urlSchema>;
export type TSlug = z.infer<typeof slugSchema>;
