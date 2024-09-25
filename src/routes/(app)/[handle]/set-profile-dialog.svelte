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
	import SetProfileForm from './set-profile-form.svelte';

	interface Props {
		open: boolean;
		profile: Pick<Profile, 'handle'>;
		data: SuperValidated<Infer<SetProfileSchema>>;
	}
	let { open = $bindable(), profile, data }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<h1 class="text-3xl">Edit profile</h1>
		<SetProfileForm {data} {profile} />
	</Dialog.Content>
</Dialog.Root>
