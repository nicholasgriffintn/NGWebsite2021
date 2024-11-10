CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text,
	`title` text,
	`description` text,
	`url` text,
	`metadata` text,
	`updated_at` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`deleted_at` integer
);
