<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { PostCard, PostCardSkeleton, PostContext, type PublicPost } from '.';
	import type { SetPostSchema } from '$lib/schemas/post/set-post';

	interface Props {
		posts: PublicPost[] | Promise<PublicPost[]>;
		setPostForm: SuperValidated<Infer<SetPostSchema>>;
	}
	const { posts, setPostForm }: Props = $props();
</script>

{#snippet postsList(data: PublicPost[])}
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
