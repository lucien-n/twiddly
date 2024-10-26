<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import { ProfileAvatar } from '@/profile';
	import { SetTwiddleForm, TwiddleContext, TwiddleFooter, TwiddleList } from '@/twiddle';
	import { Separator } from '&/separator';

	const { data } = $props();
</script>

<TwiddleContext init={{ data: data.twiddle, setTwiddleForm: data.setTwiddleForm }}>
	{#snippet children(twiddle)}
		<div class="p-4">
			<div class="mb-2 flex items-center gap-3 p-6">
				<ProfileAvatar profile={twiddle.data.author} />
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
			<div class="p-6 pt-0">
				<p class="mb-4 text-xl">
					{twiddle.data.content}
				</p>
				<p class="mb-4 flex gap-1 text-sm text-muted-foreground">
					<span>
						{formatDate(twiddle.data.createdAt)}
					</span>
					{#if twiddle.edited}
						<span>·</span>
						<span>Edited</span>
					{/if}
				</p>
			</div>
			<div class="flex items-center justify-between p-6 py-3 pt-0">
				<TwiddleFooter />
			</div>

			<Separator class="mb-8 mt-4" />

			<div class="mb-8">
				<SetTwiddleForm
					action={route('setTwiddle /actions/v1/twiddle')}
					setTwiddleForm={data.setCommentForm}
				/>
			</div>

			<div class="flex h-full">
				{#if twiddle.data.children?.length}
					<div class="h-full w-full">
						<TwiddleList twiddles={twiddle.data.children} setTwiddleForm={data.setTwiddleForm} />
					</div>
				{:else}
					<h1 class="mx-auto self-center text-3xl font-bold">No one commented yet</h1>
				{/if}
			</div>
		</div>
	{/snippet}
</TwiddleContext>
