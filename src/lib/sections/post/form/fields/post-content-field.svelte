<script lang="ts">
	import type { SetPostSchema } from '$lib/schemas/post/set-post';
	import * as Form from '&/form';
	import { Textarea } from '&/textarea';
	import { getAuthState } from '@/auth';
	import type { Infer, SuperForm } from 'sveltekit-superforms';

	interface Props {
		form: SuperForm<Infer<SetPostSchema>>;
	}

	const { form }: Props = $props();
	const { form: formData, constraints } = form;

	const authState = getAuthState();

	const MIN_LINE = 5;

	let rows: number = $state(MIN_LINE);
	$effect(() => {
		const lines = $formData.content.split('\n').length;
		rows = lines < MIN_LINE ? MIN_LINE : lines;
	});
</script>

<Form.Field {form} name="content" class="relative">
	<Form.Control let:attrs>
		<Textarea
			{...attrs}
			bind:value={$formData.content as string}
			{rows}
			class="resize-none text-lg"
			minlength={$constraints.content?.minlength}
			maxlength={$constraints.content?.maxlength}
			placeholder="What's up {authState.profile?.displayName ?? 'Stranger'} ?"
			required
		/>
		<p class="pointer-events-none absolute bottom-0 right-0 self-center p-2 text-muted-foreground">
			{$formData.content.length}/{$constraints.content?.maxlength}
		</p>
	</Form.Control>
</Form.Field>
