import type { SetPostSchema } from '$lib/schemas/post/set-post';
import type { Like, Post, Profile } from '@prisma/client';
import { getContext, setContext } from 'svelte';
import type { Infer, SuperValidated } from 'sveltekit-superforms';

export type BasePublicPost = Pick<Post, 'id' | 'edited' | 'content' | 'likeCount' | 'createdAt'> & {
	author: Pick<Profile, 'id' | 'handle' | 'displayName' | 'avatarBackgroundColor' | 'role'>;
} & {
	likes: Pick<Like, 'userId'>[];
};

export type PublicPost = BasePublicPost & {
	sourcePost?: BasePublicPost | null;
};

type SetPostForm = SuperValidated<Infer<SetPostSchema>>;

export interface PostStateInit {
	post: PublicPost;
	setPostForm: SetPostForm;
}

export class PostState {
	post: PublicPost = $state() as PublicPost;
	setPostForm: SetPostForm = $state() as SetPostForm;

	openSetDialog: boolean = $state(false);
	openDeleteDialog: boolean = $state(false);

	deleted: boolean = $state(false);
	reposting: boolean = $state(false);

	constructor({ post, setPostForm }: PostStateInit) {
		this.post = post;
		this.setPostForm = setPostForm;
	}
}

const CTX = Symbol('post_ctx');

export const getPostState = () => getContext<PostState>(CTX);

export const setPostState = (init: PostStateInit): PostState => {
	const postState = new PostState(init);
	setContext<PostState>(CTX, postState);
	return postState;
};
