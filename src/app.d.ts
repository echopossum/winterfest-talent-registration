// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: typeof import('$lib/server/auth').auth.$Infer.Session.user;
			session?: typeof import('$lib/server/auth').auth.$Infer.Session.session;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
