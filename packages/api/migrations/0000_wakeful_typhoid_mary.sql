CREATE TABLE `links` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`slug_url` text NOT NULL,
	`destination` text NOT NULL,
	`clicks` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `links` (`slug`);