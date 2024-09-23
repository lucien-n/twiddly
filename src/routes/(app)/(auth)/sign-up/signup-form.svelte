<script lang="ts">
	import { signUpSchema, type SignUpSchema } from '$lib/schemas/auth/sign-up';
	import { generateHandle } from '$lib/utils/helpers';
	import { Button } from '&/button';
	import * as Form from '&/form';
	import { Input } from '&/input';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';

	type Props = {
		data: SuperValidated<Infer<SignUpSchema>>;
		class?: string;
	};
	const { data, class: className }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signUpSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, errors, submitting } = form;

	let showPassword = $state(false);
</script>

<form method="post" use:enhance class={className}>
	<Form.Field {form} name="displayName">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.displayName}
				oninput={() => {
					$formData.handle = generateHandle($formData.displayName);
				}}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="handle">
		<Form.Control let:attrs>
			<Form.Label>Handle</Form.Label>
			<div class="relative">
				<span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
				<Input {...attrs} bind:value={$formData.handle} class="pl-7" />
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<div
				class=" flex rounded-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
			>
				<Input
					{...attrs}
					type={showPassword ? 'text' : 'password'}
					bind:value={$formData.password}
					class="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.Button class="w-full" disabled={$submitting}>Sign Up</Form.Button>
</form>
