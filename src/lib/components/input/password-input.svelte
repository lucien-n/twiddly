<script lang="ts">
	import { Button } from '&/ui/button';
	import { Input } from '&/ui/input';
	import { Eye, EyeOff } from 'lucide-svelte';
	import type { PasswordInputProps } from '.';

	let { value = $bindable(), showPassword = $bindable(), ...props }: PasswordInputProps = $props();
</script>

<div
	class=" flex rounded-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
>
	<Input
		class="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
		type={showPassword ? 'text' : 'password'}
		bind:value
		{...props}
	/>
	<Button
		onclick={() => (showPassword = !showPassword)}
		size="icon"
		variant="outline"
		class="rounded-l-none border-l-0"
	>
		{#if showPassword}
			<EyeOff />
		{:else}
			<Eye />
		{/if}
	</Button>
</div>
