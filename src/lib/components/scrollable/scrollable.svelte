<script lang="ts">
	import { cn } from '&/utils';
	import { Button } from '&/ui/button';
	import { ArrowUp } from 'lucide-svelte';
	import type { ScrollableProps } from '.';

	let { class: className, children, scroll = $bindable(0), ...props }: ScrollableProps = $props();

	let el: HTMLElement | undefined = $state();
	const handleScroll = (event: Event) => {
		const target = event.target as HTMLDivElement;
		scroll = target.scrollTop;
	};

	const resetScroll = () => {
		if (!el) return;
		el.scrollTo({ top: 0, behavior: 'smooth' });
	};

	$effect(() => {
		if (!el || scroll === el.scrollTop) return;

		el.scrollTo({ top: scroll, behavior: 'smooth' });
	});
</script>

<div
	class={cn('relative h-full w-full space-y-4 overflow-y-scroll px-1 py-4', className)}
	bind:this={el}
	onscroll={handleScroll}
	{...props}
>
	{#if scroll > 200}
		<div class="sticky left-0 right-0 top-3 z-10 mx-auto h-0 w-fit">
			<Button onclick={resetScroll}>
				<ArrowUp />
				<span>Back To Top</span>
			</Button>
		</div>
	{/if}

	{@render children()}
</div>
