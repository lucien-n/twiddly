<script lang="ts">
	import { Badge } from '&/ui/badge';
	import { Role } from '@prisma/client';

	interface Props {
		role: Role;
	}
	const { role }: Props = $props();

	const variant = $derived.by(() => {
		switch (role) {
			case Role.ADMIN:
				return 'destructive';
			case Role.RESTRICTED:
				return 'secondary';
			default:
				return 'default';
		}
	});
</script>

<Badge {variant}>
	{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
</Badge>
