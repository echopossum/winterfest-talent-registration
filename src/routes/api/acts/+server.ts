import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
	const acts = await db.query.act.findMany();
	return json(acts);
}
