import type { PrivacySettings, Profile } from '@prisma/client';
import { type VariantProps, tv } from 'tailwind-variants';
import ProfileAvatar from './profile-avatar.svelte';
import ProfileAvatarSkeleton from './profile-avatar-skeleton.svelte';

export const avatarVariants = tv({
	base: 'border rounded-full',
	variants: {
		size: {
			default: 'w-12 h-12',
			sm: 'w-8 h-8',
			md: 'w-16 h-16',
			lg: 'w-36 h-36'
		}
	},
	defaultVariants: {
		size: 'default'
	}
});

export interface Props {
	profile?:
		| (Pick<Profile, 'id' | 'handle' | 'displayName' | 'avatarBackgroundColor' | 'role'> & {
				privacySettings?: Pick<PrivacySettings, 'private'> | null;
		  })
		| null;
	size?: VariantProps<typeof avatarVariants>['size'];
	class?: string;
}

export { ProfileAvatar, ProfileAvatarSkeleton, type Props as ProfileAvatarProps };
