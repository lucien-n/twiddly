<script lang="ts">
	import { setSettingsSchema, type SetSettingsSchema } from '$lib/schemas/settings/set-settings';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '&/form';
	import { Theme } from '@prisma/client';
	import { browser } from '$app/environment';
	import { Select } from '$lib/components/select';

	interface Props {
		data: SuperValidated<Infer<SetSettingsSchema>>;
	}
	const { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(setSettingsSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;

	const getThemeOptions = (): { label: string; value: Theme }[] => [
		{
			label: 'Light',
			value: Theme.LIGHT
		},
		{
			label: 'Dark',
			value: Theme.DARK
		},
		{
			label: 'System',
			value: Theme.SYSTEM
		}
	];
</script>

<form method="post" use:enhance>
	<Form.Field {form} name="theme">
		<Form.Control let:attrs>
			<Form.Label>Theme</Form.Label>
			<Select {attrs} options={getThemeOptions()} bind:selectedOption={$formData.theme as Theme} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.Button class="w-full" disabled={$submitting || !$tainted}>Save</Form.Button>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
