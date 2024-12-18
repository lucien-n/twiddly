<script lang="ts">
	import { ProfileAvatar } from '#/profile';
	import type { Twiddle } from '$lib/models';
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/helpers';
	import { Button } from '&/ui/button';
	import * as Card from '&/ui/card';
	import { TwiddleCard } from '.';
	import { TwiddleContext } from './state';
	import TwiddleFooter from './twiddle-footer.svelte';

	interface Props {
		twiddle: Twiddle;
	}
	const { twiddle }: Props = $props();

	const profileHref = $derived(route('/[handle]/activity', { handle: twiddle.data.author.handle }));
</script>

<Card.Root class="mx-auto transition-shadow duration-300 hover:shadow-lg">
	<Card.Header>
		<div class="flex items-center space-x-4">
			<a href={profileHref}>
				<ProfileAvatar profile={twiddle.data.author} />
			</a>
			<div>
				<p class="font-semibold">{twiddle.data.author.displayName}</p>
				<Button variant="link" href={profileHref} class="h-0 p-0 text-sm text-gray-500">
					@{twiddle.data.author.handle}
				</Button>
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<a
			href={route('/[handle]/[twiddleId]', {
				handle: twiddle.data.author.handle,
				twiddleId: twiddle.data.id
			})}
		>
			<div class="break-words text-foreground">
				{#each twiddle.data.content.split('\n') as line}
					<p>{line}</p>
				{/each}
			</div>
		</a>

		{#if twiddle.data.parent && twiddle.data.parent.data}
			<div class="py-2">
				<TwiddleContext init={twiddle.data.parent}>
					{#snippet children(twiddleState)}
						<TwiddleCard twiddle={twiddleState} />
					{/snippet}
				</TwiddleContext>
			</div>
		{/if}

		<p class="mt-2 flex gap-1 text-sm text-muted-foreground">
			<span>
				{formatDate(twiddle.data.createdAt)}
			</span>
			{#if twiddle.data.isEdited}
				<span>·</span>
				<span>Edited</span>
			{/if}
		</p>
	</Card.Content>
	<Card.Footer class="justify-between py-3">
		<TwiddleFooter />
	</Card.Footer>
</Card.Root>
