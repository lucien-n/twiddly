<script lang="ts">
	import * as Avatar from '&/avatar';
	import type { Props } from '.';
	import { avatarVariants } from './index';

	const { profile, size, class: className }: Props = $props();
</script>

<Avatar.Root class={avatarVariants({ size, className })}>
	<Avatar.Image
		src="https://api.dicebear.com/9.x/notionists-neutral/svg?seed={profile.id}"
		alt="@{profile.handle}"
	/>
	<Avatar.Fallback>{profile.handle.charAt(0).toUpperCase()}</Avatar.Fallback>
</Avatar.Root>
