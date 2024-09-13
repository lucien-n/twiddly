<script lang="ts">
	import * as Tooltip from '&/tooltip';
	import type { NavItemProps } from './nav.types';

	const { label, icon, hidden, action }: NavItemProps = $props();
	const className =
		'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8';
</script>

{#snippet item()}
	<svelte:component this={icon} />
	<span class="sr-only">{label}</span>
{/snippet}

{#if !hidden}
	<Tooltip.Root>
		<Tooltip.Trigger asChild let:builder>
			{#if typeof action === 'string'}
				<a href={action} class={className} use:builder.action {...builder}>
					{@render item()}
				</a>
			{:else}
				<button onclick={action} class={className} use:builder.action {...builder}>
					{@render item()}
				</button>
			{/if}
		</Tooltip.Trigger>
		<Tooltip.Content side="right">{label}</Tooltip.Content>
	</Tooltip.Root>
{/if}
