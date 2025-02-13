PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_appearances` (
	`eventId` integer,
	`contactId` integer,
	PRIMARY KEY(`eventId`, `contactId`),
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_appearances`("eventId", "contactId") SELECT "eventId", "contactId" FROM `appearances`;--> statement-breakpoint
DROP TABLE `appearances`;--> statement-breakpoint
ALTER TABLE `__new_appearances` RENAME TO `appearances`;--> statement-breakpoint
PRAGMA foreign_keys=ON;