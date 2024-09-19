<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { Button } from '&/button';
	import type { PageData } from './$types';

	const { data } = $props();
	const { postPromise }: PageData = data;
</script>

{#await postPromise}
	<p>loading post</p>
{:then post}
	<ul>
		{#each Object.entries(post) as [k, v]}
			<li class="grid grid-cols-2 gap-3">
				<strong class="text-end">{k}</strong>
				<p>
					{#if k === 'authorId' && typeof v === 'string'}
						<Button variant="link" href={route('/u/[id]', { id: v })}>
							{v}
						</Button>
					{:else}
						{v}
					{/if}
				</p>
			</li>
		{/each}
	</ul>
{/await}
