<script lang="ts">
	import { TwiddleList } from '#/twiddle';
	import { Scrollable } from '&/scrollable';

	const { data } = $props();
</script>

<Scrollable>
	<TwiddleList twiddles={data.twiddles} />
</Scrollable>
