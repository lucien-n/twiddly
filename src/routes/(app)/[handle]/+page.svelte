<script lang="ts">
	import type { PageData } from './$types';

	const { data } = $props();
	const { profilePromise }: PageData = data;
</script>

{#await profilePromise}
	<p>loading post</p>
{:then profile}
	<ul>
		{#each Object.entries(profile) as [k, v]}
			<li class="grid grid-cols-2 gap-3">
				<strong class="text-end">{k}</strong>
				<p>
					{v}
				</p>
			</li>
		{/each}
	</ul>
{/await}
