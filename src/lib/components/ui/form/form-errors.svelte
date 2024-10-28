<script lang="ts">
	interface Props {
		errors?: string[];
	}

	let { errors = [] }: Props = $props();
</script>

<div class="text-destructive" aria-live="assertive">
	{#if errors.length}
		{#each errors as err}
			<p>{err}</p>
		{/each}
	{/if}
</div>
