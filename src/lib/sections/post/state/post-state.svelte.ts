import type { SetPostSchema } from '$lib/schemas/post/set-post';
import type { Post } from '$lib/types';
import { getContext, setContext } from 'svelte';
import type { Infer, SuperValidated } from 'sveltekit-superforms';

type SetPostForm = SuperValidated<Infer<SetPostSchema>>;

export interface PostStateInit {
	post: Post;
	setPostForm: SetPostForm;
}

export class PostState {
	post: Post = $state() as Post;
	setPostForm: SetPostForm = $state() as SetPostForm;

	openSetDialog: boolean = $state(false);
	openDeleteDialog: boolean = $state(false);

	deleted: boolean = $state(false);

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
