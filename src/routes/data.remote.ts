import { form, query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant } from '$lib/server/db/schema';
import { broadcast } from '$lib/server/events';
import { error, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { asc } from 'drizzle-orm';

export const getRegistrants = query(async () => {
	const results = await db.select().from(registrant).orderBy(asc(registrant.id));
	return results;
});

export const getActs = query(async () => {
	const acts = await db.query.score.findMany();
	return acts;
});

export const registerTalent = form(
	v.object({
		firstName: v.pipe(v.string(), v.nonEmpty('Please enter your first name')),
		lastName: v.pipe(v.string(), v.nonEmpty('Please enter your last name')),
		email: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your email'),
			v.email('Please enter a valid email')
		),
		phoneNumber: v.pipe(v.string(), v.nonEmpty('Please enter your phone number')),
		unitType: v.pipe(v.string()),
		unitNumber: v.pipe(v.number()),
		additionalMembers: v.string(),
		description: v.string()
	}),
	async ({
		firstName,
		lastName,
		email,
		phoneNumber,
		unitType,
		unitNumber,
		additionalMembers,
		description
	}) => {
		let registered;
		try {
			registered = await db
				.insert(registrant)
				.values({
					firstName,
					lastName,
					email,
					phoneNumber,
					unitType,
					unitNumber,
					additionalMembers,
					description
				})
				.returning();
		} catch (err) {
			const e = err as { cause?: { detail?: string } };
			const detail = e.cause?.detail ?? 'Database error';

			console.log(detail);
			error(409, detail);
		}

		if (registered) {
			console.log(registered[0]);
			broadcast('refresh', {});
			broadcast('stageRefresh', {});
			redirect(303, `/register/${registered[0].id}`);
		}
	}
);
