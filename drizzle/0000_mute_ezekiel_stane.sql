CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`cycle_id` text,
	`pickup_number` integer,
	`action` text NOT NULL,
	`old_status` text,
	`new_status` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_logs_restaurant_idx` ON `audit_logs` (`restaurant_id`);--> statement-breakpoint
CREATE TABLE `cycles` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`number` integer NOT NULL,
	`status` text NOT NULL,
	`started_at` text NOT NULL,
	`ended_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cycles_restaurant_number_unique` ON `cycles` (`restaurant_id`,`number`);--> statement-breakpoint
CREATE INDEX `cycles_restaurant_status_idx` ON `cycles` (`restaurant_id`,`status`);--> statement-breakpoint
CREATE TABLE `pickup_records` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`cycle_id` text NOT NULL,
	`pickup_number` integer NOT NULL,
	`status` text NOT NULL,
	`recorded_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`collected_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pickup_records_cycle_number_unique` ON `pickup_records` (`cycle_id`,`pickup_number`);--> statement-breakpoint
CREATE INDEX `pickup_records_restaurant_idx` ON `pickup_records` (`restaurant_id`);--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`pin_salt` text NOT NULL,
	`pin_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `restaurants_code_unique` ON `restaurants` (`code`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`expires_at` text NOT NULL
);
