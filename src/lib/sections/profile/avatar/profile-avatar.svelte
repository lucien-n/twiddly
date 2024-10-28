<script lang="ts">
	import { getProfileAvatar } from '$lib/utils/avatar';
	import * as Avatar from '&/ui/avatar';
	import type { Props } from '.';
	import { avatarVariants } from './index';

	const { profile, size, class: className }: Props = $props();

	const src = $derived(getProfileAvatar(profile));
</script>

<Avatar.Root
	class={avatarVariants({
		size,
		className
	})}
>
	<Avatar.Image {src} alt="@{profile.handle}" />
	<Avatar.Fallback>{profile.handle.charAt(0).toUpperCase()}</Avatar.Fallback>
</Avatar.Root>
