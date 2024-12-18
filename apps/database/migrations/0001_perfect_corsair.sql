ALTER TABLE `document` ADD `description` text;--> statement-breakpoint
ALTER TABLE `document` ADD `slug` text;--> statement-breakpoint
ALTER TABLE `document` ADD `storage_key` text;--> statement-breakpoint
ALTER TABLE `document` ADD `archived` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `document` ADD `draft` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `document` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `document` ADD `image_alt` text;--> statement-breakpoint
ALTER TABLE `document` ADD `tags` text;