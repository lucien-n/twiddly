<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/helpers';
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
	import { Scrollable } from '&/scrollable';

	const { data } = $props();
</script>

{#key data.twiddle}
	<TwiddleContext init={data.twiddle}>
		{#snippet children(twiddleState)}
			<Scrollable>
				<div class="pb-4">
					<div class="mb-2 flex items-center gap-3 pb-6">
						<ProfileAvatar size="md" profile={twiddleState.data.author} />
						<div>
							<p class="font-semibold">{twiddleState.data.author.displayName}</p>
							<Button
								variant="link"
								href={route('/[handle=handle]/activity', {
									handle: twiddleState.data.author.handle
								})}
								class="h-0 p-0 text-sm text-gray-500"
							>
								@{twiddleState.data.author.handle}
							</Button>
						</div>
					</div>
					<div>
						<div class="mb-4 break-words text-xl">
							{#each twiddleState.data.content.split('\n') as line}
								<p>{line}</p>
							{/each}
						</div>

						{#if twiddleState.data.parent}
							<TwiddleContext init={twiddleState.data.parent}>
								<TwiddleCard twiddle={twiddleState.data.parent} />
							</TwiddleContext>
						{/if}

						<p class="my-3 flex gap-1 text-sm text-muted-foreground">
							<span>
								{formatDate(twiddleState.data.createdAt)}
							</span>
							{#if twiddleState.data.isEdited}
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
						{#if twiddleState.data.comments?.length}
							<div class="w-full space-y-3">
								<TwiddleList twiddles={twiddleState.data.comments} />
							</div>
						{:else}
							<h1 class="mx-auto self-center text-3xl font-bold">No one commented yet</h1>
						{/if}
					</div>
				</div>
			</Scrollable>
		{/snippet}
	</TwiddleContext>
{/key}
