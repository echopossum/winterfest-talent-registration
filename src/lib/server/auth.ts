import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { ac, roles } from '$lib/server/permissions';

if (!env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET is not set');
if (!env.BETTER_AUTH_URL) throw new Error('BETTER_AUTH_URL is not set');

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	// Accounts are created by admins only, so the public sign-up route stays disabled.
	emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 10 },
	// The app sits behind a reverse proxy; use the client IP it forwards for rate limiting.
	advanced: { ipAddress: { ipAddressHeaders: ['x-forwarded-for'] } },
	plugins: [
		admin({ ac, roles, adminRoles: ['admin'], defaultRole: 'judge' }),
		// Must be last so cookies set inside remote functions reach the response.
		sveltekitCookies(getRequestEvent)
	]
});
