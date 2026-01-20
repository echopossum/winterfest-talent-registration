import { form } from '$app/server';
import { db } from '$lib/server/db';
import { score } from '$lib/server/db/schema';
import { broadcast } from '$lib/server/events';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const scoreTalent = form(
	v.object({
		participant: v.pipe(
			v.string(),
			v.nonEmpty('Please select a participant'),
			v.transform(Number),
			v.number()
		),
		comment: v.pipe(v.optional(v.string())),
		originality: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'Originality score required'),
			v.transform(Number),
			v.integer(),
			v.minValue(1),
			v.maxValue(10)
		),
		entertainmentValue: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number),
			v.integer(),
			v.minValue(1),
			v.maxValue(10)
		),
		audienceAppeal: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number),
			v.integer(),
			v.minValue(1),
			v.maxValue(10)
		),
		skillLevel: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number),
			v.integer(),
			v.minValue(1),
			v.maxValue(10)
		),
		aestheticAppeal: v.pipe(
			v.picklist(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
			v.transform(Number),
			v.integer(),
			v.minValue(1),
			v.maxValue(10)
		),
		judgesChoice: v.pipe(
			v.optional(v.picklist(['0', '1', '2', '3', '4', '5'])),
			v.transform((value) => Number(value ?? 0)),
			v.number(),
			v.integer(),
			v.minValue(0),
			v.maxValue(5)
		)
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
			broadcast('refresh', {});
			redirect(303, '/judge/submit');
		}
	}
);
