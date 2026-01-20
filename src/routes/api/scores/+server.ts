import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
	const data = await db.query.registrant.findMany({
		with: {
			score: true
		}
	});
	return json(data);
}
