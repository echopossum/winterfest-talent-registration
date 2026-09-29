// Creates the first admin account (public sign-up is disabled, so there is no other way in).
// Usage: npm run auth:create-admin -- --email you@example.com --name "Your Name" --password "..."
// Reads DATABASE_URL and BETTER_AUTH_SECRET from the environment (Node loads .env via --env-file).
import { parseArgs } from 'node:util';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ac, roles } from '../src/lib/server/permissions.ts';
import * as schema from '../src/lib/server/db/schema.ts';

const { values } = parseArgs({
	options: {
		email: { type: 'string' },
		name: { type: 'string' },
		password: { type: 'string' }
	}
});

const { email, name, password } = values;
if (!email || !name || !password) {
	console.error('Usage: --email <email> --name <name> --password <password (10+ chars)>');
	process.exit(1);
}
if (password.length < 10) {
	console.error('Password must be at least 10 characters');
	process.exit(1);
}
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!process.env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET is not set');

const client = postgres(process.env.DATABASE_URL);
const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	secret: process.env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(drizzle(client, { schema }), { provider: 'pg', schema }),
	emailAndPassword: { enabled: true },
	plugins: [admin({ ac, roles, adminRoles: ['admin'], defaultRole: 'judge' })]
});

try {
	const ctx = await auth.$context;
	if (await ctx.internalAdapter.findUserByEmail(email)) {
		console.error(`A user with email ${email} already exists`);
		process.exitCode = 1;
	} else {
		const user = await ctx.internalAdapter.createUser({
			email,
			name,
			role: 'admin',
			emailVerified: true
		});
		await ctx.internalAdapter.linkAccount({
			userId: user.id,
			providerId: 'credential',
			accountId: user.id,
			password: await ctx.password.hash(password)
		});
		console.log(`Created admin ${email}`);
	}
} finally {
	await client.end();
}
