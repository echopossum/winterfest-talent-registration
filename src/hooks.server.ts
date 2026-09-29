import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// Page-level gating for nicer UX only. Remote functions must call requireRole() themselves.
const protectedPaths: { prefix: string; role: 'admin' | 'judge' }[] = [
	{ prefix: '/admin', role: 'admin' },
	{ prefix: '/stage', role: 'admin' },
	{ prefix: '/judge', role: 'judge' }
];

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const { pathname } = event.url;
	const rule = protectedPaths.find(
		({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);
	if (rule) {
		const user = event.locals.user;
		if (!user)
			redirect(303, `/login?redirectTo=${encodeURIComponent(pathname + event.url.search)}`);
		if (user.role !== 'admin' && user.role !== rule.role) error(403, 'Not allowed');
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
