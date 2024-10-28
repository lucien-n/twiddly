<script lang="ts">
	import * as InputOTP from '&/ui/input-otp';
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';
	import type { OTPInputProps } from '.';

	let { value = $bindable(), ...props }: OTPInputProps = $props();
</script>

<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} bind:value>
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells.slice(0, 3) as cell}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
		<InputOTP.Separator />
		<InputOTP.Group>
			{#each cells.slice(3, 6) as cell}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>
