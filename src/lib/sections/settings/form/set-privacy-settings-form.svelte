<script lang="ts">
	import { browser } from '$app/environment';
	import { route } from '$lib/ROUTES';
	import {
		setPrivacySettingsSchema,
		type SetPrivacySettingsSchema
	} from '$lib/schemas/settings/set-settings';
	import * as Form from '&/form';
	import { Switch } from '&/switch';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		data: SuperValidated<Infer<SetPrivacySettingsSchema>>;
	}
	const { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(setPrivacySettingsSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;
</script>

<form method="post" action={route('default /settings/privacy')} use:enhance>
	<h1 class="text-3xl font-bold">Privacy</h1>

	<Form.Field {form} name="private">
		<Form.Control let:attrs>
			<Form.Label>Private</Form.Label>
			<Form.Description>Wether your profile is visible by others or not</Form.Description>
			<Switch {...attrs} bind:checked={$formData.private} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.Button class="w-full" disabled={$submitting || !$tainted}>Save</Form.Button>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
