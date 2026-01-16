import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
	const registrants = await db.query.registrant.findMany();
	return json(registrants);
}
