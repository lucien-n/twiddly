<script lang="ts">
	import type { OTPInputProps } from '.';

	let { value = $bindable(), attrs }: OTPInputProps = $props();

	let otp: string[] = $state(['', '', '', '', '', '']);
	let inputRefs: HTMLInputElement[] = $state([]);

	function handleChange(element: HTMLInputElement, index: number) {
		otp[index] = element.value;

		if (element.value !== '' && index < 5) {
			inputRefs[index + 1]?.focus();
		}
	}

	function handleKeyDown(e: KeyboardEvent, index: number) {
		if (e.key !== 'Backspace') return;

		if (index > 0 && otp[index] === '') {
			inputRefs[index - 1]?.focus();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pastedData = (e.clipboardData?.getData('text') || '')
			.replace(/[^a-zA-Z0-9]/g, '')
			.slice(0, 6)
			.split('');

		otp = [...pastedData, ...Array(6 - pastedData.length).fill('')];

		inputRefs[5]?.focus();
	}

	$effect(() => {
		value = otp.join('').toUpperCase();
	});
</script>

<input {...attrs} hidden bind:value />

<div class="flex justify-between">
	{#each otp as char, index}
		<input
			bind:this={inputRefs[index]}
			type="text"
			value={char}
			oninput={(e) => handleChange(e.currentTarget, index)}
			onkeydown={(e) => handleKeyDown(e, index)}
			onpaste={handlePaste}
			maxlength={1}
			class="flex h-16 w-12 rounded-md border border-input bg-background px-3 py-2 text-center text-2xl uppercase ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Digit {index + 1} of OTP"
		/>
	{/each}
</div>
