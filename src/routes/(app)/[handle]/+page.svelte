<script lang="ts">
	import { Separator } from '&/separator';
	import PostCard from '@/post/post-card.svelte';
	import { ProfileAvatar } from '@/profile/avatar';
	import type { PageData } from './$types';
	import PostCardSkeleton from '@/post/post-card-skeleton.svelte';

	const { data } = $props();
	const { profile, postsPromise }: PageData = data;
</script>

<div class="flex flex-col">
	<!-- {#await promise}
		<div class="flex">
			<ProfileAvatarSkeleton size="lg" />
			<div class="flex flex-col gap-1 py-6 pl-5">
				<div class="placeholder h-10 w-40"></div>
				<p class="placeholder h-6 w-24"></p>
			</div>
		</div>
	{:then { profile, posts }} -->
	<div class="flex">
		<ProfileAvatar {profile} size="lg" />
		<div class="flex flex-col gap-1 py-6 pl-5">
			<h1 class="text-4xl">{profile.displayName}</h1>
			<p class="text-muted-foreground">@{profile.handle}</p>
		</div>
	</div>

	<Separator class="my-12" />

	<div class="w-full space-y-4 py-4">
		{#await postsPromise}
			<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
			{#each { length: 5 } as _}
				<PostCardSkeleton />
			{/each}
		{:then posts}
			{#each posts as post}
				<PostCard {...post} />
			{/each}
		{/await}
	</div>
	<!-- {/await} -->
</div>
