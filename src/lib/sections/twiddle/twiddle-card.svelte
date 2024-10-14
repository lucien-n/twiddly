<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import * as Card from '&/card';
	import { ProfileAvatar } from '@/profile';
	import TwiddleFooter from './twiddle-footer.svelte';
	import { getTwiddleState } from './state/twiddle-state.svelte';

	const twiddle = getTwiddleState();

	const redirectToTwiddle = () => {
		goto(
			route('/[handle]/[twiddleId]', {
				handle: twiddle.data.author.handle,
				twiddleId: twiddle.data.id
			})
		);
	};
</script>

<Card.Root
	class="mx-auto transition-shadow duration-300 hover:cursor-pointer hover:shadow-lg"
	onclick={redirectToTwiddle}
>
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
		<p class="mb-2 text-foreground">{twiddle.data.content}</p>
		<p class="flex gap-1 text-sm text-muted-foreground">
			<span>
				{formatDate(twiddle.data.createdAt)}E
			</span>
			{#if twiddle.data.editedAt}
				<span>·</span>
				<span>Edited</span>
			{/if}
		</p>
	</Card.Content>
	<Card.Footer class="justify-between py-3">
		<TwiddleFooter />
	</Card.Footer>
</Card.Root>
