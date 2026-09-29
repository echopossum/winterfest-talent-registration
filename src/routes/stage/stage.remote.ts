import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant } from '$lib/server/db/schema';
import { broadcast } from '$lib/server/events';
import { requireRole } from '$lib/server/guard';
import { asc, eq } from 'drizzle-orm';
import * as v from 'valibot';

export const getStageView = query(async () => {
	requireRole('admin');
	const registrants = await db
		.select()
		.from(registrant)
		.orderBy(asc(registrant.performed), asc(registrant.id));
	return registrants;
});

const performedSchema = v.object({
	registrantId: v.number(),
	performed: v.boolean()
});

export const markPerformed = command(performedSchema, async ({ registrantId, performed }) => {
	requireRole('admin');
	await db
		.update(registrant)
		.set({
			performed
		})
		.where(eq(registrant.id, registrantId));
	broadcast('stageRefresh', {});
});
