export function load({ locals }) {
	return {
		user: locals.user ? { name: locals.user.name, role: locals.user.role } : null
	};
}
