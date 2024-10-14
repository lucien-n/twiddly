<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { TwiddleList, SetTwiddleForm } from '@/twiddle';
	import type { PageData } from './$types';
	import { Scrollable } from '$lib/components/scrollable';

	const { data } = $props();
	const { twiddlesPromise, setTwiddleForm }: PageData = data;
</script>

<Scrollable>
	<SetTwiddleForm {setTwiddleForm} action={route('setTwiddle /actions/v1/twiddle')} />
	<TwiddleList twiddles={twiddlesPromise} {setTwiddleForm} />
</Scrollable>
