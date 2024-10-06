import { getPosts } from '$lib/server/services/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
	postsPromise: getPosts(event.locals.session?.userId)
});
