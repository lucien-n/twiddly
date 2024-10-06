import { getPostById } from '$lib/server/services/post';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
	postPromise: getPostById(event.params.postId, event.locals.session?.userId)
});
