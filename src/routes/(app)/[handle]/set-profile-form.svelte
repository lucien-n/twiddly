<script lang="ts">
	import { browser } from '$app/environment';
	import { Select } from '$lib/components/select';
	import { route } from '$lib/ROUTES';
	import { setProfileSchema, type SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import * as Form from '&/form';
	import { Input } from '&/input';
	import { AvatarBackgroundColor, type Profile } from '@prisma/client';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		profile: Pick<Profile, 'handle'>;
		data: SuperValidated<Infer<SetProfileSchema>>;
	}
	let { profile, data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(setProfileSchema),
		onError: ({ result }) => toast.error(result.error.message)
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;
</script>

<form action={route('setProfile /[handle]', { handle: profile.handle })} method="post" use:enhance>
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
			<Form.Label>Name</Form.Label>
			<Form.Description>Your handle will be left unchanged</Form.Description>
			<Select
				{attrs}
				options={[
					{
						label: 'Thistle',
						value: AvatarBackgroundColor.THISTLE
					},
					{
						label: 'Ligth Blue',
						value: AvatarBackgroundColor.LIGTH_BLUE
					},
					{
						label: 'Lavender',
						value: AvatarBackgroundColor.LAVENDER
					},
					{
						label: 'Mistyrose',
						value: AvatarBackgroundColor.MISTYROSE
					},
					{
						label: 'Peach',
						value: AvatarBackgroundColor.PEACH
					}
				]}
				bind:selectedOption={$formData.avatarBackgroundColor as AvatarBackgroundColor}
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
