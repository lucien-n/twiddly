// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type ProfileWithSettings = import('@prisma/client').Profile & {
		interfaceSettings: import('@prisma/client').InterfaceSettings | null;
		privacySettings: import('@prisma/client').PrivacySettings | null;
	};

	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			profile: ProfileWithSettings | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
