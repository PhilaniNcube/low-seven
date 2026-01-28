PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") SELECT "id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image_url` text,
	`location` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`price` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_activity`("id", "name", "description", "image_url", "location", "duration_minutes", "price", "created_at", "updated_at") SELECT "id", "name", "description", "image_url", "location", "duration_minutes", "price", "created_at", "updated_at" FROM `activity`;--> statement-breakpoint
DROP TABLE `activity`;--> statement-breakpoint
ALTER TABLE `__new_activity` RENAME TO `activity`;--> statement-breakpoint
CREATE TABLE `__new_activity_media` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`media_url` text NOT NULL,
	`media_type` text NOT NULL,
	`alt_text` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_activity_media`("id", "activity_id", "media_url", "media_type", "alt_text", "display_order", "created_at") SELECT "id", "activity_id", "media_url", "media_type", "alt_text", "display_order", "created_at" FROM `activity_media`;--> statement-breakpoint
DROP TABLE `activity_media`;--> statement-breakpoint
ALTER TABLE `__new_activity_media` RENAME TO `activity_media`;--> statement-breakpoint
CREATE INDEX `activity_media_activityId_idx` ON `activity_media` (`activity_id`);--> statement-breakpoint
CREATE TABLE `__new_admin_user` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`permissions` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_admin_user`("id", "user_id", "role", "permissions", "is_active", "created_at", "updated_at") SELECT "id", "user_id", "role", "permissions", "is_active", "created_at", "updated_at" FROM `admin_user`;--> statement-breakpoint
DROP TABLE `admin_user`;--> statement-breakpoint
ALTER TABLE `__new_admin_user` RENAME TO `admin_user`;--> statement-breakpoint
CREATE UNIQUE INDEX `admin_user_user_id_unique` ON `admin_user` (`user_id`);--> statement-breakpoint
CREATE INDEX `admin_user_userId_idx` ON `admin_user` (`user_id`);--> statement-breakpoint
CREATE INDEX `admin_user_isActive_idx` ON `admin_user` (`is_active`);--> statement-breakpoint
CREATE TABLE `__new_booking_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`activity_id` text NOT NULL,
	`guide_id` text,
	`price_at_booking` real NOT NULL,
	`scheduled_at` integer,
	FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`guide_id`) REFERENCES `guide`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_booking_activity`("id", "booking_id", "activity_id", "guide_id", "price_at_booking", "scheduled_at") SELECT "id", "booking_id", "activity_id", "guide_id", "price_at_booking", "scheduled_at" FROM `booking_activity`;--> statement-breakpoint
DROP TABLE `booking_activity`;--> statement-breakpoint
ALTER TABLE `__new_booking_activity` RENAME TO `booking_activity`;--> statement-breakpoint
CREATE INDEX `booking_activity_guideId_idx` ON `booking_activity` (`guide_id`);--> statement-breakpoint
CREATE TABLE `__new_booking` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`package_id` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`total_price` real NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`special_requests` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`package_id`) REFERENCES `package`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_booking`("id", "user_id", "package_id", "status", "total_price", "start_date", "end_date", "special_requests", "created_at", "updated_at") SELECT "id", "user_id", "package_id", "status", "total_price", "start_date", "end_date", "special_requests", "created_at", "updated_at" FROM `booking`;--> statement-breakpoint
DROP TABLE `booking`;--> statement-breakpoint
ALTER TABLE `__new_booking` RENAME TO `booking`;--> statement-breakpoint
CREATE INDEX `booking_user_idx` ON `booking` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_guide` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`bio` text,
	`specialties` text,
	`image_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_guide`("id", "name", "email", "phone", "bio", "specialties", "image_url", "is_active", "created_at", "updated_at") SELECT "id", "name", "email", "phone", "bio", "specialties", "image_url", "is_active", "created_at", "updated_at" FROM `guide`;--> statement-breakpoint
DROP TABLE `guide`;--> statement-breakpoint
ALTER TABLE `__new_guide` RENAME TO `guide`;--> statement-breakpoint
CREATE UNIQUE INDEX `guide_email_unique` ON `guide` (`email`);--> statement-breakpoint
CREATE INDEX `guide_email_idx` ON `guide` (`email`);--> statement-breakpoint
CREATE INDEX `guide_isActive_idx` ON `guide` (`is_active`);--> statement-breakpoint
CREATE TABLE `__new_package_media` (
	`id` text PRIMARY KEY NOT NULL,
	`package_id` text NOT NULL,
	`media_url` text NOT NULL,
	`media_type` text NOT NULL,
	`alt_text` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `package`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_package_media`("id", "package_id", "media_url", "media_type", "alt_text", "display_order", "created_at") SELECT "id", "package_id", "media_url", "media_type", "alt_text", "display_order", "created_at" FROM `package_media`;--> statement-breakpoint
DROP TABLE `package_media`;--> statement-breakpoint
ALTER TABLE `__new_package_media` RENAME TO `package_media`;--> statement-breakpoint
CREATE INDEX `package_media_packageId_idx` ON `package_media` (`package_id`);--> statement-breakpoint
CREATE TABLE `__new_package` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text,
	`is_custom` integer DEFAULT 0 NOT NULL,
	`base_price` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_package`("id", "name", "description", "image_url", "is_custom", "base_price", "created_at", "updated_at") SELECT "id", "name", "description", "image_url", "is_custom", "base_price", "created_at", "updated_at" FROM `package`;--> statement-breakpoint
DROP TABLE `package`;--> statement-breakpoint
ALTER TABLE `__new_package` RENAME TO `package`;--> statement-breakpoint
CREATE TABLE `__new_payment` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`payment_method` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`transaction_id` text,
	`payment_provider` text,
	`payment_intent_id` text,
	`metadata` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_payment`("id", "booking_id", "amount", "currency", "payment_method", "status", "transaction_id", "payment_provider", "payment_intent_id", "metadata", "created_at", "updated_at") SELECT "id", "booking_id", "amount", "currency", "payment_method", "status", "transaction_id", "payment_provider", "payment_intent_id", "metadata", "created_at", "updated_at" FROM `payment`;--> statement-breakpoint
DROP TABLE `payment`;--> statement-breakpoint
ALTER TABLE `__new_payment` RENAME TO `payment`;--> statement-breakpoint
CREATE INDEX `payment_bookingId_idx` ON `payment` (`booking_id`);--> statement-breakpoint
CREATE INDEX `payment_status_idx` ON `payment` (`status`);--> statement-breakpoint
CREATE INDEX `payment_transactionId_idx` ON `payment` (`transaction_id`);--> statement-breakpoint
CREATE TABLE `__new_review` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_activity_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`is_verified` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`booking_activity_id`) REFERENCES `booking_activity`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_review`("id", "booking_activity_id", "user_id", "rating", "comment", "is_verified", "created_at", "updated_at") SELECT "id", "booking_activity_id", "user_id", "rating", "comment", "is_verified", "created_at", "updated_at" FROM `review`;--> statement-breakpoint
DROP TABLE `review`;--> statement-breakpoint
ALTER TABLE `__new_review` RENAME TO `review`;--> statement-breakpoint
CREATE INDEX `review_bookingActivityId_idx` ON `review` (`booking_activity_id`);--> statement-breakpoint
CREATE INDEX `review_userId_idx` ON `review` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id") SELECT "id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT 0 NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "email_verified", "image", "created_at", "updated_at") SELECT "id", "name", "email", "email_verified", "image", "created_at", "updated_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `__new_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_verification`("id", "identifier", "value", "expires_at", "created_at", "updated_at") SELECT "id", "identifier", "value", "expires_at", "created_at", "updated_at" FROM `verification`;--> statement-breakpoint
DROP TABLE `verification`;--> statement-breakpoint
ALTER TABLE `__new_verification` RENAME TO `verification`;--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);