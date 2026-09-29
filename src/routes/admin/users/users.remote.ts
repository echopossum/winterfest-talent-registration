import { command, form, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/server/auth';
import { requireRole } from '$lib/server/guard';
import { invalid } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import * as v from 'valibot';

const roleSchema = v.picklist(['judge', 'admin']);
const passwordSchema = v.pipe(
	v.string(),
	v.minLength(10, 'Password must be at least 10 characters')
);

function headers() {
	return getRequestEvent().request.headers;
}

// Stops an admin from locking themselves out by demoting, banning or deleting their own account.
function assertNotSelf(userId: string) {
	if (requireRole('admin').id === userId) invalid('You cannot do that to your own account');
}

async function run<T>(action: () => Promise<T>): Promise<T> {
	try {
		return await action();
	} catch (err) {
		if (err instanceof APIError) invalid(err.message);
		throw err;
	}
}

export const getUsers = query(async () => {
	requireRole('admin');
	const { users } = await auth.api.listUsers({
		query: { limit: 200, sortBy: 'createdAt', sortDirection: 'asc' },
		headers: headers()
	});
	return users.map((u) => ({
		id: u.id,
		name: u.name,
		email: u.email,
		role: u.role ?? 'judge',
		banned: !!u.banned
	}));
});

export const createUser = form(
	v.object({
		name: v.pipe(v.string(), v.nonEmpty('Please enter a name')),
		email: v.pipe(v.string(), v.nonEmpty('Please enter an email'), v.email('Invalid email')),
		_password: passwordSchema,
		role: roleSchema
	}),
	async ({ name, email, _password, role }) => {
		requireRole('admin');
		await run(() =>
			auth.api.createUser({ body: { name, email, password: _password, role }, headers: headers() })
		);
		await getUsers().refresh();
	}
);

export const setUserPassword = form(
	v.object({ userId: v.string(), _password: passwordSchema }),
	async ({ userId, _password }) => {
		requireRole('admin');
		await run(() =>
			auth.api.setUserPassword({ body: { userId, newPassword: _password }, headers: headers() })
		);
	}
);

export const setUserRole = command(
	v.object({ userId: v.string(), role: roleSchema }),
	async ({ userId, role }) => {
		assertNotSelf(userId);
		await run(() => auth.api.setRole({ body: { userId, role }, headers: headers() }));
	}
);

export const setUserBanned = command(
	v.object({ userId: v.string(), banned: v.boolean() }),
	async ({ userId, banned }) => {
		assertNotSelf(userId);
		await run(() =>
			banned
				? auth.api.banUser({ body: { userId, banReason: 'Disabled by admin' }, headers: headers() })
				: auth.api.unbanUser({ body: { userId }, headers: headers() })
		);
	}
);

export const removeUser = command(v.object({ userId: v.string() }), async ({ userId }) => {
	assertNotSelf(userId);
	await run(() => auth.api.removeUser({ body: { userId }, headers: headers() }));
});
