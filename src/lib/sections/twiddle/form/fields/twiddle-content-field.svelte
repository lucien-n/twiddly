<script lang="ts">
	import { getAuthState } from '#/auth';
	import { MAX_CONTENT_LENGTH } from '$lib/schemas/twiddle/fields';
	import type { SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
	import { getSanitizedContentLength, sanitizeTwiddleContent } from '$lib/utils/helpers';
	import * as Form from '&/ui/form';
	import { Textarea } from '&/ui/textarea';
	import type { FormEventHandler } from 'svelte/elements';
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
		const lines = sanitizedContent.split('\n').length;
		return Math.max(MIN_LINES, Math.min(lines, MAX_LINES));
	};

	const sanitizedContent = $derived(sanitizeTwiddleContent($formData.content));
	const sanitizedContentLength = $derived(getSanitizedContentLength(sanitizedContent));
	const rows: number = $derived(getRows());

	const handleChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
		if (sanitizedContentLength <= MAX_CONTENT_LENGTH) {
			return;
		}

		$formData.content = event.currentTarget.value.slice(0, MAX_CONTENT_LENGTH);
	};
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
				oninput={handleChange}
				onchange={handleChange}
				placeholder={placeholder ?? `What's up ${authState.profile?.displayName ?? 'Stranger'} ?`}
				autofocus
			/>
		{/snippet}
	</Form.Control>
</Form.Field>
