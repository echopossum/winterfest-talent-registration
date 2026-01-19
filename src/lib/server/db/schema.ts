import { pgTable, serial, varchar, pgEnum, integer, boolean } from 'drizzle-orm/pg-core';

export const roles = pgEnum('roles', ['admin', 'judge', 'guest']);

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	userName: varchar('user_name').notNull(),
	userRole: roles('role'),
	password: varchar('password').notNull()
});

export const registrant = pgTable('registrant', {
	id: serial('id').primaryKey(),
	firstName: varchar('first_name').notNull(),
	lastName: varchar('last_name').notNull(),
	email: varchar('email').notNull().unique(),
	phoneNumber: varchar('phone_number').notNull(),
	additionalMembers: varchar('additional_members'),
	unitType: varchar('unit_type'),
	unitNumber: integer().notNull(),
	description: varchar('description'),
	performed: boolean('performed').notNull().default(false)
});

export const score = pgTable('score', {
	id: serial('id').primaryKey(),
	participant: integer('participant')
		.notNull()
		.references(() => registrant.id, { onDelete: 'cascade' }),
	originality: integer('originality').notNull(),
	entertainmentValue: integer('entertainment_value').notNull(),
	audienceAppeal: integer('audience_appeal').notNull(),
	skillLevel: integer('skill_level').notNull(),
	aestheticAppeal: integer('aesthetic_appeal').notNull(),
	judgesChoice: integer('judges_choice').notNull(),
	comment: varchar('comment')
});
