<!-- @migration-task Error while migrating Svelte code: Can only bind to an Identifier or MemberExpression -->
<script lang="ts">
	import type { SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
	import * as Form from '&/ui/form';
	import { Textarea } from '&/ui/textarea';
	import { getAuthState } from '@/auth';
	import type { Infer, SuperForm } from 'sveltekit-superforms';

	interface Props {
		form: SuperForm<Infer<SetTwiddlechema>>;
		placeholder?: string;
	}

	const { form, placeholder }: Props = $props();
	const { form: formData, constraints } = form;

	const authState = getAuthState();

	const MAX_LINES = 20;
	const MIN_LINES = 5;

	const getRows = () => {
		const lines = content.split('\n').length;
		return Math.max(MIN_LINES, Math.min(lines, MAX_LINES));
	};

	const content = $derived($formData.content.trimEnd());
	const rows: number = $derived(getRows());
</script>

<Form.Field {form} name="content" class="relative">
	<Form.Control>
		{#snippet children({ props })}
			<Textarea
				{...props}
				bind:value={$formData.content as string}
				{rows}
				class="resize-none text-lg"
				minlength={$constraints.content?.minlength}
				maxlength={$constraints.content?.maxlength}
				placeholder={placeholder ?? `What's up ${authState.profile?.displayName ?? 'Stranger'} ?`}
				autofocus
			/>
			<p
				class="pointer-events-none absolute bottom-0 right-0 self-center p-2 text-muted-foreground"
			>
				{content.length}/{$constraints.content?.maxlength}
			</p>
		{/snippet}
	</Form.Control>
</Form.Field>
