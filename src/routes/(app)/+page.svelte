<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { PostList, SetPostForm } from '@/post';
	import type { PageData } from './$types';
	import { Scrollable } from '$lib/components/scrollable';

	const { data } = $props();
	const { postsPromise, setPostForm }: PageData = data;
</script>

<Scrollable>
	<SetPostForm {setPostForm} action={route('setPost /actions/v1/post')} />
	<PostList posts={postsPromise} {setPostForm} />
</Scrollable>
