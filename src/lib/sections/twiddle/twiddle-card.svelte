<script lang="ts">
	import { goto } from '$app/navigation';
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/ui/button';
	import * as Card from '&/ui/card';
	import { ProfileAvatar } from '@/profile';
	import TwiddleFooter from './twiddle-footer.svelte';
	import { getTwiddleState } from './state/twiddle-state.svelte';

	const twiddle = getTwiddleState();

	const twiddleHref = $derived(
		route('/[handle]/[twiddleId]', {
			handle: twiddle.data.author.handle,
			twiddleId: twiddle.data.id
		})
	);

	const redirectToTwiddle = () => {
		goto(twiddleHref);
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
			<a href={twiddleHref} aria-label={twiddle.data.content}>
				{formatDate(twiddle.data.createdAt)}
			</a>
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
