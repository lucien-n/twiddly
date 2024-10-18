<script lang="ts">
	import { PageInfos } from '$lib/components/page-infos';
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import { ProfileAvatar } from '@/profile';
	import { TwiddleContext, TwiddleFooter } from '@/twiddle';
	import type { PageData } from './$types';

	const { data } = $props();
	const { twiddle, setTwiddleForm }: PageData = data;
</script>

<PageInfos />

<TwiddleContext init={{ data: twiddle, setTwiddleForm }}>
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
		</div>
	{/snippet}
</TwiddleContext>
