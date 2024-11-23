<!-- @migration-task Error while migrating Svelte code: Can only bind to an Identifier or MemberExpression -->
<script lang="ts">
	import { route } from '$lib/ROUTES';
	import {
		setInterfaceSettingsSchema,
		type SetInterfaceSettingsSchema
	} from '$lib/schemas/settings/set-settings';
	import { SingleSelect } from '&/select';
	import * as Form from '&/ui/form';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import SetSettingsForm from './set-settings-form.svelte';
	import { superSettingsForm } from './super-settings-form';
	import { ThemeColor, ThemeMode } from '@prisma/client';

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
	<Form.Field {form} name="themeMode">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Theme Mode</Form.Label>
				<Form.Description>Your preferred app interface mode</Form.Description>
				<SingleSelect
					{...props}
					options={[
						{
							label: 'Light',
							value: ThemeMode.LIGHT
						},
						{
							label: 'Dark',
							value: ThemeMode.DARK
						},
						{
							label: 'System',
							value: ThemeMode.SYSTEM
						}
					]}
					bind:value={$formData.themeMode as ThemeMode}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="themeColor">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Theme Color</Form.Label>
				<Form.Description>Your preferred app interface color</Form.Description>
				<SingleSelect
					{...props}
					options={[
						{
							label: 'Black & White',
							value: ThemeColor.DEFAULT
						},
						{
							label: 'Green',
							value: ThemeColor.GREEN
						},
						{
							label: 'Violet',
							value: ThemeColor.VIOLET
						}
					]}
					bind:value={$formData.themeColor as ThemeColor}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</SetSettingsForm>
