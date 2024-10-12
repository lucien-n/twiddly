import { fetcher } from '$lib/utils/fetcher';
import type { SetPostSchema } from '$lib/schemas/post/set-post';
import type { Like, Post, Profile } from '@prisma/client';
import { getContext, setContext } from 'svelte';
import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { toast } from 'svelte-sonner';
import { route } from '$lib/ROUTES';

export type PostData = Pick<Post, 'id' | 'editedAt' | 'content' | 'likeCount' | 'createdAt'> & {
	author: Pick<Profile, 'id' | 'handle' | 'displayName' | 'avatarBackgroundColor' | 'role'>;
} & {
	likes: Pick<Like, 'profileId'>[];
};

type SetPostForm = SuperValidated<Infer<SetPostSchema>>;

export interface PostStateInit {
	data: PostData;
	setPostForm: SetPostForm;
}

export class PostState {
	data: PostData = $state() as PostData;
	setPostForm: SetPostForm = $state() as SetPostForm;

	openSetDialog: boolean = $state(false);
	openDeleteDialog: boolean = $state(false);

	deleted: boolean = $state(false);
	edited: boolean = $state(false);
	liked: boolean = $state(false);
	likes: number = $state(0);

	constructor({ data, setPostForm }: PostStateInit) {
		this.data = data;
		this.setPostForm = setPostForm;
		this.likes = data.likeCount;
		this.liked = data.likes.length > 0;
		this.edited = !!data.editedAt;
	}

	async toggleLike() {
		const url = this.liked
			? route('POST /api/v1/post/[id]/unlike', { id: this.data.id })
			: route('POST /api/v1/post/[id]/like', { id: this.data.id });

		const { data, error } = await fetcher<number>(url, 'POST');

		if (error) {
			toast.error(error);
			return;
		}

		if (data !== undefined) {
			this.likes = data;
			this.liked = !this.liked;
		}
	}

	async delete() {
		const url = route('POST /api/v1/post/[id]/delete', { id: this.data.id });
		const { data, error } = await fetcher<boolean>(url, 'POST');

		if (error) {
			toast.error(error);
			return;
		}

		if (data) {
			this.deleted = data;
			toast.success('Post deleted successfully!');
		}
	}
}

const CTX = Symbol('post_ctx');

export const getPostState = () => getContext<PostState>(CTX);

export const setPostState = (init: PostStateInit): PostState => {
	const postState = new PostState(init);
	setContext<PostState>(CTX, postState);
	return postState;
};
