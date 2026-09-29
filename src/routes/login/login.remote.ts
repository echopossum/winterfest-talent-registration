import { form, getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';
import { invalid, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import * as v from 'valibot';

// Only same-origin absolute paths; rejects "//host" and "/\host" open redirects.
function safeRedirect(target: string | undefined, fallback: string) {
	return target && /^\/(?![/\\])/.test(target) ? target : fallback;
}

export const login = form(
	v.object({
		email: v.pipe(v.string(), v.nonEmpty('Please enter your email')),
		// The leading underscore keeps the password from being sent back to the client on failure.
		_password: v.pipe(v.string(), v.nonEmpty('Please enter your password')),
		redirectTo: v.optional(v.string())
	}),
	async ({ email, _password, redirectTo }) => {
		let role: string | null | undefined;
		try {
			const result = await auth.api.signInEmail({ body: { email, password: _password } });
			role = result.user.role;
		} catch (err) {
			if (err instanceof APIError) invalid('Invalid email or password');
			throw err;
		}

		redirect(303, safeRedirect(redirectTo, role === 'admin' ? '/admin' : '/judge'));
	}
);

export const logout = form(async () => {
	await auth.api.signOut({ headers: getRequestEvent().request.headers });
	redirect(303, '/login');
});
