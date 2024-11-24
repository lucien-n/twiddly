import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setTwiddleSchema, type SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
import { formatProfile, getProfileSelect, type Profile } from './profile';
import { Role, type Like, type Prisma } from '@prisma/client';

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

export const isLiked = (
	currentUserId: string | undefined,
	likes: Pick<Like, 'profileId'>[]
): boolean => !!currentUserId && likes.some(({ profileId }) => currentUserId === profileId);

export const getTwiddleSelect = (currentUserId?: string) => ({
	id: true,
	editedAt: true,
	content: true,
	createdAt: true,
	likeCount: true,
	commentCount: true,
	author: { select: getProfileSelect() },
	likes: { where: { profileId: currentUserId } }
});

export const getTwiddleOrderBy = (
	orderBy?: Prisma.TwiddleOrderByWithRelationInput
): Prisma.TwiddleOrderByWithRelationInput => ({
	createdAt: 'desc',
	...orderBy
});

export const getTwiddleWhere = (where?: Prisma.TwiddleWhereInput): Prisma.TwiddleWhereInput => ({
	deletedAt: null,
	author: { user: { deletedAt: null }, role: { not: Role.RESTRICTED } },
	...where
});
