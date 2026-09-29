import { query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

// Public: only the fields the waitlist display shows. No email, phone or description.
export const getWaitlist = query(async () => {
	return db
		.select({
			id: registrant.id,
			firstName: registrant.firstName,
			lastName: registrant.lastName,
			unitType: registrant.unitType,
			unitNumber: registrant.unitNumber,
			performed: registrant.performed
		})
		.from(registrant)
		.orderBy(asc(registrant.performed), asc(registrant.id));
});
