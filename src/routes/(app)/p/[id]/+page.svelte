<script lang="ts">
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
					{v}
				</p>
			</li>
		{/each}
	</ul>
{/await}
