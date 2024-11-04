<script lang="ts">
	import { Badge } from '&/ui/badge';
	import { Role } from '@prisma/client';

	interface Props {
		role: Role;
	}
	const { role }: Props = $props();
</script>

<Badge variant={role === Role.ADMIN ? 'destructive' : 'default'}>
	{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
</Badge>
