import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import type { AppRole } from '$lib/server/permissions';

// Remote functions are served from /_app/remote/..., not the route path, so route-level
// redirects in hooks.server.ts do not protect them. Call this at the top of every remote
// function that touches privileged data.
export function requireRole(role: AppRole) {
	const { locals } = getRequestEvent();
	const user = locals.user;
	if (!user) error(401, 'Please log in');
	// Admins can do everything a judge can.
	if (user.role !== 'admin' && user.role !== role) error(403, 'Not allowed');
	return user;
}
