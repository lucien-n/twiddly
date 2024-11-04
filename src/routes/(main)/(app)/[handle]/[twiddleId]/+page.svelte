<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/ui/button';
	import { Separator } from '&/ui/separator';
	import { ProfileAvatar } from '#/profile';
	import {
		SetTwiddleForm,
		TwiddleCard,
		TwiddleContext,
		TwiddleFooter,
		TwiddleList
	} from '#/twiddle';

	const { data } = $props();
</script>

{#key data.twiddle}
	<TwiddleContext init={data.twiddle}>
		{#snippet children(twiddle)}
			<div class="p-4">
				<div class="mb-2 flex items-center gap-3 py-6">
					<ProfileAvatar size="md" profile={twiddle.data.author} />
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
				<div>
					<p class="mb-4 text-xl">
						{twiddle.data.content}
					</p>

					{#if twiddle.data.parent}
						<TwiddleContext init={twiddle.data.parent}>
							<TwiddleCard />
						</TwiddleContext>
					{/if}

					<p class="my-3 flex gap-1 text-sm text-muted-foreground">
						<span>
							{formatDate(twiddle.data.createdAt)}
						</span>
						{#if twiddle.data.isEdited}
							<span>·</span>
							<span>Edited</span>
						{/if}
					</p>

					<div class="flex items-center justify-between">
						<TwiddleFooter />
					</div>
				</div>

				<Separator class="mb-8 mt-4" />

				<div class="mb-8">
					<SetTwiddleForm
						action={route('setTwiddle /actions/v1/twiddle')}
						setTwiddleForm={data.twiddle.setCommentForm}
					/>
				</div>

				<div class="flex h-full">
					{#if twiddle.data.comments?.length}
						<div class="w-full space-y-3">
							<TwiddleList twiddles={twiddle.data.comments} />
						</div>
					{:else}
						<h1 class="mx-auto self-center text-3xl font-bold">No one commented yet</h1>
					{/if}
				</div>
			</div>
		{/snippet}
	</TwiddleContext>
{/key}
