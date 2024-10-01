import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutServerLoad } from './$types';
import { setPostSchema } from '$lib/schemas/post/set-post';
import { superValidate } from 'sveltekit-superforms';

export const load: LayoutServerLoad = async () => ({
	setPostForm: await superValidate(zod(setPostSchema))
});
