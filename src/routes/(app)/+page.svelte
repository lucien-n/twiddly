<script lang="ts">
	import { Scrollable } from '&/scrollable';
	import { route } from '$lib/ROUTES';
	import { SetTwiddleForm, TwiddleList } from '#/twiddle';

	const { data } = $props();
</script>

<Scrollable>
	<SetTwiddleForm
		setTwiddleForm={data.setTwiddleForm}
		action={route('setTwiddle /actions/v1/twiddle')}
	/>
	<TwiddleList twiddles={data.twiddles} />
</Scrollable>
