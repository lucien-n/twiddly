<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/button';
	import type { PageData } from './$types';
	import CreatePostForm from './create-post-form.svelte';

	const { data } = $props();
	const { postsPromise, createPostForm }: PageData = data;
</script>

<CreatePostForm data={createPostForm} />

{#await postsPromise}
	<p>loading posts</p>
{:then posts}
	<ul>
		{#each posts as post (post.id)}
			<li class="flex justify-between">
				<p>
					{post.content}
				</p>
				<Button
					variant="link"
					href={route('/[profileId]/[postId]', {
						profileId: data.session!.userId,
						postId: post.id
					})}
				>
					{post.id}
				</Button>
			</li>
		{/each}
	</ul>
{/await}
