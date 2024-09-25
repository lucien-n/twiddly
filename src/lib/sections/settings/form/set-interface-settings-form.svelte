<script lang="ts">
	import { browser } from '$app/environment';
	import { Select } from '$lib/components/select';
	import { route } from '$lib/ROUTES';
	import {
		setInterfaceSettingsSchema,
		type SetInterfaceSettingsSchema
	} from '$lib/schemas/settings/set-settings';
	import * as Form from '&/form';
	import { Theme } from '@prisma/client';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		data: SuperValidated<Infer<SetInterfaceSettingsSchema>>;
	}
	const { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(setInterfaceSettingsSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;
</script>

<form method="post" action={route('default /settings/interface')} use:enhance>
	<h1 class="text-3xl font-bold">Interface</h1>

	<Form.Field {form} name="theme">
		<Form.Control let:attrs>
			<Form.Label>Theme</Form.Label>
			<Form.Description>Your preferred appearance for the app interface</Form.Description>
			<Select
				{attrs}
				options={[
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
				]}
				bind:selectedOption={$formData.theme as Theme}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.Button class="w-full" disabled={$submitting || !$tainted}>Save</Form.Button>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
