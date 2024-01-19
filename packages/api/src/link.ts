import { Context } from "hono";
import { HonoContext, db } from ".";
import { TLink, TLinkCreate, TSlug } from "./models";
import { eq } from "drizzle-orm";
import { links } from "./db/schema";
import { APIResponse } from "./response";

export class Link {
	private c: Context<HonoContext>;
	private origin: string;

	constructor(c: Context<HonoContext>) {
		this.c = c;
		this.origin = new URL(c.req.url).origin;
	}

	async create(body: TLinkCreate) {
		const link = await db.query.links.findFirst({ where: eq(links.slug, body.slug) });

		if (link) {
			return APIResponse<{ message: string }>({
				data: { message: `Slug of ${link.slug} already exists. Try another one!` },
			});
		}

		const slugUrl = `${this.origin}/${body.slug}`;

		const created = await db.insert(links).values({
			slugUrl,
			...body,
		});

		if (created.success) {
			return APIResponse<{ url: string }>({ data: { url: slugUrl } });
		}

		return APIResponse<{ message: string }>({ data: { message: "Could not create." } });
	}

	async analytics(slug: TSlug) {
		const link = await db.query.links.findFirst({ where: eq(links.slug, slug) });

		if (!link) {
			return this.c.notFound();
		}

		return APIResponse<{ link: TLink }>({ data: { link } });
	}

	async tryRedirect(slug: TSlug) {
		const link = await db.query.links.findFirst({ where: eq(links.slug, slug) });

		if (!link) {
			return this.c.notFound();
		}

		this.c.executionCtx.waitUntil(
			Promise.resolve(
				db
					.update(links)
					.set({ clicks: link.clicks + 1 })
					.where(eq(links.id, link.id)),
			),
		);

		return this.c.redirect(link.destination);
	}
}
