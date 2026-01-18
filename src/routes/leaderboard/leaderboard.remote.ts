import { query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant, score } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export const getLeaderboard = query(async () => {
	const leaderboard = await db
		.select({
			id: registrant.id,
			firstName: registrant.firstName,
			lastName: registrant.lastName,
			unitType: registrant.unitType,
			unitNumber: registrant.unitNumber,
			total: sql<number>`
        coalesce(
          sum(
            ${score.originality} +
            ${score.entertainmentValue} +
            ${score.audienceAppeal} +
            ${score.skillLevel} +
            ${score.aestheticAppeal} +
            ${score.judgesChoice}
          ),
          0
        )
      `.as('total')
		})
		.from(registrant)
		.leftJoin(score, eq(score.participant, registrant.id))
		.groupBy(registrant.id)
		.orderBy(desc(sql`total`), registrant.lastName, registrant.firstName);

	return leaderboard;
});
