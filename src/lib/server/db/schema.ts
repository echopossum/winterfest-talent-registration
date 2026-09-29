import { relations, type InferSelectModel } from 'drizzle-orm';
import {
	pgTable,
	serial,
	varchar,
	integer,
	boolean,
	text,
	timestamp,
	index
} from 'drizzle-orm/pg-core';

// Better Auth tables, generated with `npx auth generate`. The admin plugin adds
// role/banned/banReason/banExpires to user and impersonatedBy to session.
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	role: text('role'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires')
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		impersonatedBy: text('impersonated_by')
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

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
	judgesChoice: integer('judges_choice').notNull().default(0),
	comment: varchar('comment'),
	judgeId: text('judge_id').references(() => user.id, { onDelete: 'set null' })
});

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	scores: many(score)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

export const registrantRelations = relations(registrant, ({ many }) => ({
	score: many(score)
}));

export const scoreRelations = relations(score, ({ one }) => ({
	participant: one(registrant, {
		fields: [score.participant],
		references: [registrant.id]
	}),
	judge: one(user, {
		fields: [score.judgeId],
		references: [user.id]
	})
}));

export type Registrant = InferSelectModel<typeof registrant>;
export type Score = InferSelectModel<typeof score>;
