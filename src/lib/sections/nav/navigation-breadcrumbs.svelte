<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import * as Breadcrumb from '&/ui/breadcrumb';
	import { route } from '@/lib/ROUTES';

	const paths = $derived(browser ? $page.url.pathname.split('/') : []);
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{#each paths as path, index}
			{@const className = index === 0 ? 'hidden md:block' : ''}
			{@const label =
				index === 0 ? 'Home' : path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()}
			{@const href =
				index === 0 ? route('/') : PUBLIC_ORIGIN + '/' + paths.slice(0, index).join('/')}
			<Breadcrumb.Item class={className}>
				{#if index < paths.length - 1}
					<Breadcrumb.Link {href}>
						{label}
					</Breadcrumb.Link>
				{:else}
					<Breadcrumb.Page>
						{label}
					</Breadcrumb.Page>
				{/if}
			</Breadcrumb.Item>
			{#if index < paths.length - 1}
				<Breadcrumb.Separator class="mt-1 hidden md:block" />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
