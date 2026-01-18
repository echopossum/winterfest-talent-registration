import { pgTable, serial, varchar, pgEnum, integer } from 'drizzle-orm/pg-core';

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
	description: varchar('description')
});

export const score = pgTable('score', {
	id: serial('id').primaryKey(),
	participant: serial('participant').references(() => registrant.id),
	originality: integer('originality').notNull(),
	entertainmentValue: integer('entertainment_value').notNull(),
	audienceAppeal: integer('audience_appeal').notNull(),
	skillLevel: integer('skill_level').notNull(),
	aestheticAppeal: integer('aesthetic_appeal').notNull(),
	judgesChoice: integer('judges_choice').notNull(),
	comment: varchar('comment')
});
