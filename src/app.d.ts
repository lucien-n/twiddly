import type { PageInfosProps } from '#/application';
import type { Profile } from './lib';

// for information about these interfaces
declare global {
	type ProfileWithSettings = Profile & {
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
			infos: PageInfosProps;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
