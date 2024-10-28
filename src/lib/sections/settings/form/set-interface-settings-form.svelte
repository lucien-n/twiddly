<!-- @migration-task Error while migrating Svelte code: Can only bind to an Identifier or MemberExpression -->
<script lang="ts">
	import { Select } from '$lib/components/select';
	import { route } from '$lib/ROUTES';
	import {
		setInterfaceSettingsSchema,
		type SetInterfaceSettingsSchema
	} from '$lib/schemas/settings/set-settings';
	import * as Form from '&/ui/form';
	import { Theme } from '@prisma/client';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import SetSettingsForm from './set-settings-form.svelte';
	import { superSettingsForm } from './super-settings-form';

	interface Props {
		data: SuperValidated<Infer<SetInterfaceSettingsSchema>>;
	}
	const { data }: Props = $props();

	const form = superSettingsForm(data, setInterfaceSettingsSchema);
	const { form: formData } = form;
</script>

<SetSettingsForm
	label="Interface"
	action={route('setInterfaceSettings /actions/v1/settings')}
	{form}
>
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
</SetSettingsForm>
