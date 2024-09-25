<script lang="ts">
	import { Separator } from '&/separator';
	import PostCard from '@/post/post-card.svelte';
	import { ProfileAvatar } from '@/profile/avatar';
	import type { PageData } from './$types';
	import PostCardSkeleton from '@/post/post-card-skeleton.svelte';
	import { Lock } from 'lucide-svelte';
	import * as Tooltip from '&/tooltip';
	import { getAuthState } from '@/auth/auth-state.svelte';
	import { Dropdown } from '$lib/components/dropdown';
	import { EllipsisVertical } from 'lucide-svelte';
	import * as Dialog from '&/dialog';
	import * as Form from '&/form';
	import { route } from '$lib/ROUTES';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { setProfileSchema, type SetProfileSchema } from '$lib/schemas/profile/set-profile';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { Input } from '&/input';
	import type { Profile } from '@prisma/client';

	interface Props {
		profile: Pick<Profile, 'handle'>;
		data: SuperValidated<Infer<SetProfileSchema>>;
	}
	let { profile, data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(setProfileSchema),
		onError: ({ result }) => {
			console.log(result);
			toast.error(result.error.message);
		}
	});
	const { form: formData, enhance, errors, submitting, tainted } = form;
</script>

<form action={route('setProfile /[handle]', { handle: profile.handle })} method="post" use:enhance>
	<Form.Field {form} name="displayName">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.displayName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Errors errors={$errors._errors} />

	<Form.Button class="w-full" disabled={$submitting || !$tainted}>Save</Form.Button>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
