import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant, score } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

export const getAdminView = query(async () => {
	const data = await db.query.registrant.findMany({
		with: {
			score: true
		}
	});

	return data;
});

export const deleteRegistrant = command(
	v.object({ registrantId: v.number() }),
	async ({ registrantId }) => {
		const deleted = await db.delete(registrant).where(eq(registrant.id, registrantId)).returning();
		console.log(deleted);
	}
);

export const editRegistrant = form(
	v.object({
		id: v.number(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		email: v.optional(v.string()),
		phoneNumber: v.optional(v.string()),
		unitType: v.optional(v.picklist(['Post', 'Crew', 'Ship', 'Troop', 'Other'])),
		unitNumber: v.optional(v.number()),
		additionalMembers: v.optional(v.string()),
		description: v.optional(v.string())
	}),
	async ({
		id,
		firstName,
		lastName,
		email,
		phoneNumber,
		unitType,
		unitNumber,
		additionalMembers,
		description
	}) => {
		const updated = await db
			.update(registrant)
			.set({
				firstName,
				lastName,
				email,
				phoneNumber,
				unitType,
				unitNumber,
				additionalMembers,
				description
			})
			.where(eq(registrant.id, id))
			.returning();

		console.log(updated);
	}
);

export const deleteScore = command(
	v.object({
		scoreId: v.number()
	}),
	async ({ scoreId }) => {
		const deleted = await db.delete(score).where(eq(score.id, scoreId)).returning();
		console.log(deleted);
	}
);

export const editScore = form(
	v.object({
		id: v.number(),
		originality: v.optional(v.number()),
		entertainmentValue: v.optional(v.number()),
		audienceAppeal: v.optional(v.number()),
		skillLevel: v.optional(v.number()),
		aestheticAppeal: v.optional(v.number()),
		judgesChoice: v.optional(v.number()),
		comment: v.optional(v.string())
	}),
	async ({
		id,
		originality,
		entertainmentValue,
		audienceAppeal,
		skillLevel,
		aestheticAppeal,
		judgesChoice,
		comment
	}) => {
		const updated = await db
			.update(score)
			.set({
				originality,
				entertainmentValue,
				audienceAppeal,
				skillLevel,
				aestheticAppeal,
				judgesChoice,
				comment
			})
			.where(eq(score.id, id))
			.returning();

		console.log(updated);
	}
);
