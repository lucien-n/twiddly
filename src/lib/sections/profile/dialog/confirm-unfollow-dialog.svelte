<script lang="ts">
	import type { Profile } from '$lib/models';
	import * as AlertDialog from '&/ui/alert-dialog';

	interface Props {
		profile: Profile;
		open: boolean;
		onconfirm: () => void;
	}
	let { profile, open = $bindable(), onconfirm }: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Unfollow {profile.displayName}</AlertDialog.Title>
			<AlertDialog.Description>
				Their profile is private, you won't be able to follow them again.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={onconfirm}>Confirm</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
