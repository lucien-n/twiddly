<script lang="ts">
	import { route } from '$lib/ROUTES';
	import {
		adminSetSiteSettingsSchema,
		type AdminSetSiteSettingsSchema
	} from '$lib/schemas/admin/set-site-settings';
	import { onSuperFormError } from '$lib/utils/super-form';
	import { SingleSelect, type SingleSelectOption } from '&/select';
	import * as Form from '&/ui/form';
	import { MaintenanceMode } from '@prisma/client';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		setSiteSettingsForm: SuperValidated<Infer<AdminSetSiteSettingsSchema>>;
	}
	const { setSiteSettingsForm }: Props = $props();

	const form = superForm(setSiteSettingsForm, {
		validators: zodClient(adminSetSiteSettingsSchema),
		onError: onSuperFormError
	});
	const { enhance, submitting, errors, form: formData, tainted } = form;

	const loading = $derived($submitting);

	const maintenanceModeOptions: SingleSelectOption<MaintenanceMode>[] = [
		{ label: 'Open', description: 'Unrestricted access', value: MaintenanceMode.OPEN },
		{
			label: 'Verified',
			description: 'Only verified users and admins',
			value: MaintenanceMode.VERIFIED
		},
		{ label: 'Admin', description: 'Only admins', value: MaintenanceMode.ADMIN },
		{
			label: 'Locked',
			description: 'Unaccessible by anyone USE WITH CAUTION',
			value: MaintenanceMode.LOCKED
		}
	];
</script>

<form method="post" action={route('setSiteSettings /admin/settings')} use:enhance>
	<Form.Field {form} name="maintenanceMode">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Maintenance Mode</Form.Label>
				<SingleSelect
					{...props}
					options={maintenanceModeOptions}
					bind:value={$formData.maintenanceMode as MaintenanceMode}
					placeholder="Maintenance mode"
				/>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.LoadingButton {loading} disabled={!$tainted} class="mt-31">
		<p>{loading ? 'Saving...' : 'Save'}</p>
	</Form.LoadingButton>
</form>
