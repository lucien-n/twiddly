<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		children: Snippet;
		footer?: Snippet;
	}

	const { title, description, children, footer }: Props = $props();
</script>

<div class="h-screen w-full lg:grid lg:grid-cols-2">
	<div class="hidden items-center bg-muted lg:flex">
		<img src="/twiddly.svg" alt="twiddly" class="w-full object-cover dark:brightness-[0.2]" />
	</div>
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">
					{title}
				</h1>
				<p class="text-balance text-muted-foreground">
					{description}
				</p>
			</div>
			<div class="grid gap-4">
				{@render children()}
			</div>
			<div class="mt-4 text-center text-sm">
				{#if footer}
					{@render footer()}
				{/if}
			</div>
		</div>
	</div>
</div>
