CREATE TABLE `appearances` (
	`eventId` integer,
	`contactId` integer,
	PRIMARY KEY(`eventId`, `contactId`),
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
