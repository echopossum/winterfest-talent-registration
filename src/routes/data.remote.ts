import { form, query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant, score } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const getRegistrants = query(async () => {
	const results = await db.query.registrant.findMany();
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
		const registered = await db
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

		if (registered) {
			console.log(registered[0]);
			redirect(303, `/register/${registered[0].id}`);
		}
	}
);

export const scoreTalent = form(
	v.object({
		participant: v.pipe(v.string(), v.transform(Number), v.number()),
		comment: v.string(),
		originality: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number)
		),
		entertainmentValue: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number)
		),
		audienceAppeal: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number)
		),
		skillLevel: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number)
		),
		aestheticAppeal: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number)
		),
		judgesChoice: v.pipe(v.picklist(['1', '2', '3', '4', '5']), v.transform(Number))
	}),
	async ({
		participant,
		comment,
		originality,
		entertainmentValue,
		audienceAppeal,
		skillLevel,
		aestheticAppeal,
		judgesChoice
	}) => {
		const scored = await db
			.insert(score)
			.values({
				participant,
				comment,
				originality,
				entertainmentValue,
				audienceAppeal,
				skillLevel,
				aestheticAppeal,
				judgesChoice
			})
			.returning();

		if (scored) {
			console.log(scored[0]);
		}
	}
);
