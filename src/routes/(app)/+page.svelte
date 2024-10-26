<script lang="ts">
	import { Scrollable } from '$lib/components/scrollable';
	import { route } from '$lib/ROUTES';
	import { SetTwiddleForm, TwiddleList } from '@/twiddle';
	import type { PageData } from './$types';

	const { data } = $props();
	const { twiddles, setTwiddleForm }: PageData = data;
</script>

<Scrollable>
	<SetTwiddleForm {setTwiddleForm} action={route('setTwiddle /actions/v1/twiddle')} />
	<TwiddleList {twiddles} {setTwiddleForm} />
</Scrollable>
