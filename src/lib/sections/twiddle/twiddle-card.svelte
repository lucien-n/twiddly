<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/ui/button';
	import * as Card from '&/ui/card';
	import { ProfileAvatar } from '#/profile';
	import { getTwiddleState } from './state/twiddle-state.svelte';
	import TwiddleFooter from './twiddle-footer.svelte';

	const twiddle = getTwiddleState();
</script>

<Card.Root class="mx-auto transition-shadow duration-300 hover:shadow-lg">
	<Card.Header>
		<div class="flex items-center space-x-4">
			<a href={route('/[handle]', { handle: twiddle.data.author.handle })}>
				<ProfileAvatar profile={twiddle.data.author} />
			</a>
			<div>
				<p class="font-semibold">{twiddle.data.author.displayName}</p>
				<Button
					variant="link"
					href={route('/[handle]', { handle: twiddle.data.author.handle })}
					class="h-0 p-0 text-sm text-gray-500"
				>
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
			<div class="text-foreground">
				{#each twiddle.data.content.split('\n') as line}
					<p>{line}</p>
				{/each}
			</div>
			<p class="mt-2 flex gap-1 text-sm text-muted-foreground">
				<span>
					{formatDate(twiddle.data.createdAt)}
				</span>
				{#if twiddle.data.isEdited}
					<span>·</span>
					<span>Edited</span>
				{/if}
			</p>
		</a>
	</Card.Content>
	<Card.Footer class="justify-between py-3">
		<TwiddleFooter />
	</Card.Footer>
</Card.Root>
