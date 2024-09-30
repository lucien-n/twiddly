<script lang="ts">
	import {
		AVATAR_BACKGROUND_COLORS,
		type AvatarParams
	} from '$lib/external/dicebear.notionists-neutral';
	import * as Avatar from '&/avatar';
	import { AvatarBackgroundColor } from '@prisma/client';
	import type { Props } from '.';
	import { avatarVariants } from './index';

	const { profile, size, class: className }: Props = $props();

	const getAvatarBgColor = (bg: AvatarBackgroundColor | null) =>
		AVATAR_BACKGROUND_COLORS[bg ?? AvatarBackgroundColor.LAVENDER].replace('#', '');

	const getSearchParams = (): URLSearchParams =>
		new URLSearchParams({
			seed: profile.id,
			backgroundColor: getAvatarBgColor(profile.avatarBackgroundColor)
		} satisfies AvatarParams);

	const searchParams = $derived(getSearchParams());
</script>

<Avatar.Root
	class={avatarVariants({
		size,
		className
	})}
>
	<Avatar.Image
		src={'https://api.dicebear.com/9.x/notionists-neutral/svg?' + searchParams.toString()}
		alt="@{profile.handle}"
	/>
	<Avatar.Fallback>{profile.handle.charAt(0).toUpperCase()}</Avatar.Fallback>
</Avatar.Root>
