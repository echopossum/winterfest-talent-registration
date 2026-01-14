import { pgTable, serial, varchar, uuid, pgEnum, integer } from 'drizzle-orm/pg-core';

export const roles = pgEnum('roles', ['admin', 'judge', 'guest']);

export const unitType = pgEnum('unit_type', ['post', 'crew', 'ship', 'troop', 'other']);

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
	email: varchar('email').notNull(),
	phoneNumber: varchar('phone_number').notNull(),
	unitType: unitType('unit_type').notNull(),
	unitNumber: integer().notNull()
});

export const act = pgTable('act', {
	participant: serial('participant').references(() => registrant.id),
	description: varchar('description'),
	originality: integer('originality').notNull(),
	entertainmentValue: integer('entertainment_value').notNull(),
	audienceAppeal: integer('audience_appeal').notNull(),
	skillLevel: integer('skill_level').notNull(),
	aestheticAppeal: integer('aesthetic_appeal').notNull(),
	judgesChoice: integer('judges_choice').notNull()
});
