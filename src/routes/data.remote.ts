import { form, query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const getRegistrants = query(async () => {
	const results = await db.query.registrant.findMany();
	return results;
});

export const getActs = query(async () => {
	const acts = await db.query.act.findMany();
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
		unitNumber: v.pipe(v.string(), v.toNumber())
	}),
	async ({ firstName, lastName, email, phoneNumber, unitType, unitNumber }) => {
		console.log('we got here');
		const registered = await db
			.insert(registrant)
			.values({
				firstName,
				lastName,
				email,
				phoneNumber,
				unitType,
				unitNumber
			})
			.returning();

		if (registered) {
			console.log('we did it');
			console.log(registered[0]);
			redirect(303, `/register/${registered[0].id}`);
			setTimeout(() => {
				redirect(303, '/');
			}, 5000);
		}
	}
);
