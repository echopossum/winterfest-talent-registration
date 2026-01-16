import { db } from '$lib/server/db';
import { registrant } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	const registrants = await db.query.registrant.findMany();
	return json(registrants);
}

export async function POST({ request }) {
	const { firstName, lastName, email, phoneNumber, unitType, unitNumber } = await request.json();
	try {
		const reg = await db
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
		console.log(reg[0]);
		return json(reg[0]);
	} catch (errorMessage) {
		if (errorMessage instanceof Error) {
			error(409, errorMessage);
		}
		error(409, String(errorMessage));
	}
}
