<script lang="ts">
	import { route } from '$lib/ROUTES';
	import {
		setInterfaceSettingsSchema,
		type SetInterfaceSettingsSchema
	} from '$lib/schemas/settings/set-settings';
	import { ColorSelect, SingleSelect } from '&/select';
	import * as Form from '&/ui/form';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import SetSettingsForm from './set-settings-form.svelte';
	import { superSettingsForm } from './super-settings-form';
	import { ThemeColor, ThemeMode } from '@prisma/client';
	import { setMode, setTheme } from 'mode-watcher';
	import { getModeWatcherThemeColor, getModeWatcherThemeMode } from '@/lib/utils/theme';

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
					onValueChange={(themeMode) => {
						setMode(getModeWatcherThemeMode(themeMode as ThemeMode));
					}}
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
				<ColorSelect
					{...props}
					options={[
						{
							label: 'Black & White',
							value: ThemeColor.DEFAULT,
							color: 'black'
						},
						{
							label: 'Green',
							value: ThemeColor.GREEN,
							color: 'hsl(142.1 70.6% 45.3%)'
						},
						{
							label: 'Violet',
							value: ThemeColor.VIOLET,
							color: 'hsl(263.4 70% 50.4%)'
						},
						{
							label: 'Rose',
							value: ThemeColor.ROSE,
							color: 'hsl(346.8 77.2% 49.8%)'
						}
					]}
					bind:value={$formData.themeColor as ThemeColor}
					onValueChange={(themeColor) => {
						setTheme(getModeWatcherThemeColor(themeColor as ThemeColor));
					}}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</SetSettingsForm>
