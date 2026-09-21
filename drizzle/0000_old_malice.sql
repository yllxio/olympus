CREATE TABLE `imports` (
	`id` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`user_id` text NOT NULL,
	`key` text NOT NULL,
	`data` text NOT NULL,
	`updated` integer NOT NULL,
	PRIMARY KEY(`user_id`, `key`)
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`draft` text,
	`updated` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_kind` ON `records` (`kind`);--> statement-breakpoint
CREATE TABLE `revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `revisions_record` ON `revisions` (`record_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text,
	`photo` text,
	`admin` integer DEFAULT 0 NOT NULL,
	`expires` integer NOT NULL
);
