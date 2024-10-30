<script lang="ts">
	import { cn } from '&/utils';
	import { Button } from '&/ui/button';
	import { ArrowUp } from 'lucide-svelte';
	import type { ScrollableProps } from '.';

	const { class: className, children, ...props }: ScrollableProps = $props();

	let el: HTMLElement | undefined = $state();
	let scroll: number = $state(0);
	const handleScroll = (event: Event) => {
		const target = event.target as HTMLDivElement;
		scroll = target.scrollTop;
	};

	const resetScroll = () => {
		if (!el) return;
		el.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<div
	class={cn('relative h-full w-full space-y-4 overflow-y-scroll px-1 py-4', className)}
	bind:this={el}
	onscroll={handleScroll}
>
	{#if scroll > 200}
		<div class="sticky left-0 right-0 top-3 z-10 mx-auto w-fit">
			<Button onclick={resetScroll}>
				<ArrowUp />
				<span>Back To Top</span>
			</Button>
		</div>
	{/if}

	{@render children()}
</div>
