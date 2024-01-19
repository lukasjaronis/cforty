import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const links = sqliteTable(
	"links",
	{
		id: integer("id").primaryKey(),
		slug: text("slug").notNull(),
		slugUrl: text("slug_url").notNull(),
		destination: text("destination").notNull(),
		clicks: integer("clicks").notNull().default(0),
	},
	(table) => ({
		slugIdx: uniqueIndex("slug_idx").on(table.slug),
	}),
);
