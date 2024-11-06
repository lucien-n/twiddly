import { AvatarBackgroundColor, type Role } from '@prisma/client';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { setTwiddleSchema, type SetTwiddlechema } from './schemas/twiddle/set-twiddle';
import { zod } from 'sveltekit-superforms/adapters';

export interface Twiddle {
	data: {
		id: string;
		content: string;
		createdAt: Date;
		isEdited: boolean;
		author: {
			id: string;
			role: Role;
			bio: string;
			handle: string;
			displayName: string;
			avatarBackgroundColor: AvatarBackgroundColor;
			isPrivate: boolean;
		};
		likeCount: number;
		isLiked: boolean;
		commentCount: number;
		comments?: Twiddle[];
		parent?: Twiddle;
	};
	setTwiddleForm: SuperValidated<Infer<SetTwiddlechema>>;
	setCommentForm: SuperValidated<Infer<SetTwiddlechema>>;
}

export const formatTwiddle = async (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	t: any,
	currentUserId: string | undefined
): Promise<Twiddle> => {
	const data = {
		id: t.id,
		content: t.content,
		createdAt: t.createdAt,
		parent: t.parent ? await formatTwiddle(t.parent, currentUserId) : undefined,
		isEdited: !!t.editedAt,
		likeCount: t.likeCount,
		commentCount: t.commentCount,
		comments: t.children ? await formatTwiddles(t.children, currentUserId) : [],
		isLiked: currentUserId
			? t.likes.some(({ profileId }: { profileId: string }) => profileId === currentUserId)
			: false,
		author: {
			bio: t.bio,
			id: t.author.id,
			role: t.author.role,
			handle: t.author.handle,
			displayName: t.author.displayName,
			avatarBackgroundColor: t.author.avatarBackgroundColor ?? AvatarBackgroundColor.LAVENDER,
			isPrivate: !!t.author.privacySettings?.private
		}
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
