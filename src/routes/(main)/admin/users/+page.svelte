<script lang="ts">
	import UsersTable from './table/users-table.svelte';
	import { columns } from './table/columns';

	const { data } = $props();
</script>

<div class="h-screen w-full overflow-y-hidden p-6">
	<UsersTable data={data.users} {columns} />
</div>
