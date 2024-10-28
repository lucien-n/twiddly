<!-- @migration-task Error while migrating Svelte code: Can only bind to an Identifier or MemberExpression -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { ColorSelect } from '$lib/components/select';
	import { AVATAR_BACKGROUND_COLORS } from '$lib/external/dicebear.notionists-neutral';
	import { route } from '$lib/ROUTES';
	import { setProfileSchema, type SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import { handleSuperResult, onSuperFormError } from '$lib/utils/super-form';
	import * as Form from '&/ui/form';
	import { Input } from '&/ui/input';
	import { AvatarBackgroundColor } from '@prisma/client';
	import type { ActionResult } from '@sveltejs/kit';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		data: SuperValidated<Infer<SetProfileSchema>>;
		onSuccess?: (result: ActionResult) => void;
	}
	let { data, onSuccess }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(setProfileSchema),
		onError: onSuperFormError,
		onResult: (event) => handleSuperResult(event, { onSuccess })
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;

	const loading = $derived($submitting);
</script>

<form method="post" action={route('setProfile /actions/v1/profile')} use:enhance>
	<Form.Field {form} name="displayName">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Form.Description>Your handle will be left unchanged</Form.Description>
			<Input {...attrs} bind:value={$formData.displayName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="avatarBackgroundColor">
		<Form.Control let:attrs>
			<Form.Label>Avatar Color</Form.Label>
			<Form.Description>Your avatar's background color</Form.Description>
			<ColorSelect
				{attrs}
				options={[
					{
						label: 'Thistle',
						value: AvatarBackgroundColor.THISTLE,
						color: AVATAR_BACKGROUND_COLORS[AvatarBackgroundColor.THISTLE]
					},
					{
						label: 'Ligth Blue',
						value: AvatarBackgroundColor.LIGTH_BLUE,
						color: AVATAR_BACKGROUND_COLORS[AvatarBackgroundColor.LIGTH_BLUE]
					},
					{
						label: 'Lavender',
						value: AvatarBackgroundColor.LAVENDER,
						color: AVATAR_BACKGROUND_COLORS[AvatarBackgroundColor.LAVENDER]
					},
					{
						label: 'Mistyrose',
						value: AvatarBackgroundColor.MISTYROSE,
						color: AVATAR_BACKGROUND_COLORS[AvatarBackgroundColor.MISTYROSE]
					},
					{
						label: 'Peach',
						value: AvatarBackgroundColor.PEACH,
						color: AVATAR_BACKGROUND_COLORS[AvatarBackgroundColor.PEACH]
					},
					{
						label: 'Lime',
						value: AvatarBackgroundColor.LIME,
						color: AVATAR_BACKGROUND_COLORS[AvatarBackgroundColor.LIME]
					}
				]}
				bind:value={$formData.avatarBackgroundColor as AvatarBackgroundColor}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.LoadingButton class="w-full" {loading} disabled={!$tainted}>
		{loading ? 'Saving' : 'Save'}
	</Form.LoadingButton>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
