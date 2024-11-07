import { AvatarBackgroundColor, type Role } from '@prisma/client';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setTwiddleSchema, type SetTwiddlechema } from './schemas/twiddle/set-twiddle';
import { getProfileAvatar } from './utils/avatar';

export interface Profile {
	id: string;
	bio: string;
	role: Role;
	avatar: string;
	handle: string;
	createdAt: Date;
	isPrivate: boolean;
	displayName: string;
}

export interface Twiddle {
	data: {
		id: string;
		content: string;
		createdAt: Date;
		isEdited: boolean;
		author: Profile;
		likeCount: number;
		isLiked: boolean;
		commentCount: number;
		comments?: Twiddle[];
		parent?: Twiddle;
	};
	setTwiddleForm: SuperValidated<Infer<SetTwiddlechema>>;
	setCommentForm: SuperValidated<Infer<SetTwiddlechema>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatProfile = (p: any): Profile => ({
	id: p.id,
	bio: p.bio,
	role: p.role,
	handle: p.handle,
	avatar:
		p.handle && p.avatarBackgroundColor
			? getProfileAvatar(p)
			: getProfileAvatar({
					handle: 'unknown',
					avatarBackgroundColor: AvatarBackgroundColor.MISTYROSE
				}),
	createdAt: p.createdAt,
	displayName: p.displayName,
	isPrivate: Boolean(p.privacySettings?.private)
});

export const formatTwiddle = async (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	t: any,
	currentUserId: string | undefined
): Promise<Twiddle> => {
	const deleted = !!t.deleted;
	const data = {
		id: t.id,
		content: deleted ? 'This post has been deleted' : t.content,
		createdAt: t.createdAt,
		parent: t.parent ? await formatTwiddle(t.parent, currentUserId) : undefined,
		isEdited: deleted ? false : !!t.editedAt,
		likeCount: deleted ? 0 : t.likeCount,
		commentCount: t.commentCount,
		comments: t.children ? await formatTwiddles(t.children, currentUserId) : [],
		isLiked: deleted
			? false
			: currentUserId
				? t.likes.some(({ profileId }: { profileId: string }) => profileId === currentUserId)
				: false,
		author: formatProfile(t.author)
	};

	return {
		data,
		setTwiddleForm: await superValidate(data, zod(setTwiddleSchema), { id: `${data.id}-edit` }),
		setCommentForm: await superValidate({ parentId: data.id }, zod(setTwiddleSchema), {
			id: `${data.id}-comment`
		})
	};
};

export const formatTwiddles = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[],
	currentUserId: string | undefined
): Promise<Twiddle[]> => Promise.all(data.map((d) => formatTwiddle(d, currentUserId)));

export const sanitizeTwiddleContent = (content: string): string => {
	const formatted = content
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n');

	return formatted;
};

export const getSanitizedContentLength = (sanitizedContent: string) =>
	sanitizedContent.split('\n').join('').length;
