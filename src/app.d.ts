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
			siteSettings: import('@prisma/client').SiteSettings | null;
		}
		interface PageData {
			infos: {
				title: string;
				description?: string;
				author?: string;
				image?: string;
				imageType?: string;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
