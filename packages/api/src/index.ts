import hono, { Hono } from "hono";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import { ENV, envSchema } from "./env";
import { logger } from "hono/logger";
import { bearerAuth } from "hono/bearer-auth";
import { Link } from "./link";
import { TLinkCreate, linkCreateSchema, slugSchema } from "./models";
import { APIResponse } from "./response";

class NOOP {
	constructor() {}
}

export type HonoContext = { Bindings: ENV };

export let db: DrizzleD1Database<typeof schema> = new NOOP() as DrizzleD1Database<typeof schema>;

export const app = new Hono<HonoContext>();

app.use("*", async (c, next) => {
	logger();

	await next();
});

app.use("/protected/*", async (c, next) => {
	const auth = bearerAuth({
		token: c.env.AUTHENTICATION_TOKEN,
	});

	await auth(c, next);
});

app.post("/api/create", async (c) => {
	const body = await c.req.json<TLinkCreate>();
	const validatedBody = linkCreateSchema.safeParse(body);

	if (!validatedBody.success) {
		return APIResponse<{ message: string }>({
			data: { message: "Could not validate body type." },
		});
	}

	const instance = new Link(c);
	return instance.create(validatedBody.data);
});

app.get("/:slug", async (c) => {
	const slug = c.req.param("slug");
	const validatedParam = slugSchema.safeParse(slug);

	if (!validatedParam.success) {
		return APIResponse<{ message: string }>({
			data: { message: "Could not validate param type." },
		});
	}

	const instance = new Link(c);
	return instance.tryRedirect(slug);
});

app.get("/api/analytics/:slug", async (c) => {
	const slug = c.req.param("slug");
	const validatedParam = slugSchema.safeParse(slug);

	if (!validatedParam.success) {
		return APIResponse<{ message: string }>({
			data: { message: "Could not validate param type." },
		});
	}

	const instance = new Link(c);
	return instance.analytics(slug);
});

export default {
	async fetch(request: Request, env: ENV, ctx: ExecutionContext) {
		const validatedEnv = envSchema.safeParse(env);

		if (!validatedEnv.success) {
			return Response.json({ message: "Could not validate ENVs!" });
		}

		if (!(db instanceof DrizzleD1Database)) {
			db = drizzle(env.CFORTY_DB, { schema });
		}

		return app.fetch(request, validatedEnv.data, ctx);
	},
};
