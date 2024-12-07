<script lang="ts">
	import { Scrollable } from '&/scrollable';
	import { route } from '$lib/ROUTES';
	import { SetTwiddleForm, TwiddleList } from '#/twiddle';
	import type { TabProps } from '&/tabs/index.js';
	import { Tabs } from '&/tabs';
	import { getTabFromParam, type HomeTab } from './types';
	import { page } from '$app/stores';

	const { data } = $props();

	let currentTab: HomeTab = $state(getTabFromParam($page.url.searchParams.get('tab')));
	const tabs: TabProps<HomeTab>[] = $derived([
		{
			label: 'Discover',
			href: route('/', { tab: 'discover' }),
			value: 'discover'
		},
		{
			label: 'Following',
			href: route('/', { tab: 'following' }),
			value: 'following'
		}
	] as const);
</script>

<Scrollable>
	<SetTwiddleForm
		setTwiddleForm={data.setTwiddleForm}
		action={route('setTwiddle /actions/v1/twiddle')}
	/>

	<Tabs {tabs} bind:current={currentTab} class="w-full transition-all duration-200 ease-in-out" />

	<TwiddleList twiddles={data.twiddlesPromise}>
		{#snippet empty({ props })}
			<h1 {...props}>It's quite empty here 😞</h1>
		{/snippet}
	</TwiddleList>
</Scrollable>
