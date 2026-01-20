import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
	const scores = await db.query.score.findMany();
	return json(scores);
}
