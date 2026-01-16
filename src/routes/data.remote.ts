import { form, query } from '$app/server';
import { db } from '$lib/server/db';

export const getRegistrants = query(async () => {
	const results = await db.query.registrant.findMany();
	return results;
});

export const getActs = query(async () => {
	const acts = await db.query.act.findMany();
	return acts;
});

export const registerTalent = form(async () => {});
