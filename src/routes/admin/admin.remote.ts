import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { registrant, score } from '$lib/server/db/schema';
import { broadcast } from '$lib/server/events';
import { eq, asc } from 'drizzle-orm';
import * as v from 'valibot';

export const getAdminView = query(async () => {
  const data = await db.query.registrant.findMany({
    orderBy: asc(registrant.id),
    with: {
      score: {
        orderBy: asc(score.id)
      }
    }
  });

  return data;
});

export const deleteRegistrant = command(
  v.object({ registrantId: v.number() }),
  async ({ registrantId }) => {
    const deleted = await db.delete(registrant).where(eq(registrant.id, registrantId)).returning();
    console.log(deleted);
    broadcast('refresh', {});
  }
);

export const editRegistrant = form(
  v.object({
    id: v.number(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    unitType: v.optional(v.picklist(['Post', 'Crew', 'Ship', 'Troop', 'Other'])),
    unitNumber: v.optional(v.number()),
  }),
  async ({
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    unitType,
    unitNumber,
  }) => {
    const updated = await db
      .update(registrant)
      .set({
        firstName,
        lastName,
        email,
        phoneNumber,
        unitType,
        unitNumber,
      })
      .where(eq(registrant.id, id))
      .returning();

    console.log(updated);
    broadcast('refresh', {})
  }
);

export const deleteScore = command(
  v.object({
    scoreId: v.number()
  }),
  async ({ scoreId }) => {
    await db.delete(score).where(eq(score.id, scoreId)).returning();
    broadcast('refresh', {})
  }
);

export const editScore = form(
  v.object({
    id: v.number(),
    originality: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(10))),
    entertainmentValue: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(10))),
    audienceAppeal: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(10))),
    skillLevel: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(10))),
    aestheticAppeal: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(10))),
    judgesChoice: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(5))),
  }),
  async ({
    id,
    originality,
    entertainmentValue,
    audienceAppeal,
    skillLevel,
    aestheticAppeal,
    judgesChoice,
  }) => {
    await db
      .update(score)
      .set({
        originality,
        entertainmentValue,
        audienceAppeal,
        skillLevel,
        aestheticAppeal,
        judgesChoice,
      })
      .where(eq(score.id, id))
      .returning();
    broadcast('refresh', {})
  }
);
