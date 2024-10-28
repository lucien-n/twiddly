<script lang="ts">
	import { route } from '$lib/ROUTES';
	import {
		setPrivacySettingsSchema,
		type SetPrivacySettingsSchema
	} from '$lib/schemas/settings/set-settings';
	import * as Form from '&/ui/form';
	import { Switch } from '&/ui/switch';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import SetSettingsForm from './set-settings-form.svelte';
	import { superSettingsForm } from './super-settings-form';

	interface Props {
		data: SuperValidated<Infer<SetPrivacySettingsSchema>>;
	}
	const { data }: Props = $props();

	const form = superSettingsForm(data, setPrivacySettingsSchema);
	const { form: formData } = form;
</script>

<SetSettingsForm label="Privacy" action={route('setPrivacySettings /actions/v1/settings')} {form}>
	<Form.Field {form} name="private">
		<Form.Control >
			{#snippet children({ attrs })}
						<Form.Label>Private</Form.Label>
				<Form.Description>Wether your profile is visible by others or not</Form.Description>
				<Switch {...attrs} bind:checked={$formData.private} />
								{/snippet}
				</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</SetSettingsForm>
