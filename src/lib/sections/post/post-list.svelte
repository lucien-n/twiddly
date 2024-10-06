<script lang="ts">
	import type { SetPostSchema } from '$lib/schemas/post/set-post';
	import type { Post } from '$lib/types';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { PostCard, PostCardSkeleton, PostContext } from '.';

	interface Props {
		posts: Post[] | Promise<Post[]>;
		setPostForm: SuperValidated<Infer<SetPostSchema>>;
	}
	const { posts, setPostForm }: Props = $props();
</script>

{#snippet postsList(data: Post[])}
	{#each data as post (post.id)}
		<PostContext init={{ post, setPostForm }}>
			{#snippet children(postState)}
				{#if !postState.deleted}
					<PostCard />
				{/if}
			{/snippet}
		</PostContext>
	{/each}
{/snippet}

{#if posts instanceof Promise}
	{#await posts}
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each { length: 5 } as _}
			<PostCardSkeleton />
		{/each}
	{:then data}
		{@render postsList(data)}
	{/await}
{:else}
	{@render postsList(posts)}
{/if}
