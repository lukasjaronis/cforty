import { z } from "zod";

export const envSchema = z.object({
	ENVIRONMENT: z.enum(["development", "production"]).default("development"),
	AUTHENTICATION_TOKEN: z.string(),
	CFORTY_DB: z.custom<D1Database>(),
});

export type ENV = z.infer<typeof envSchema>;
