<script lang="ts">
	import UsersTable from './table/users-table.svelte';
	import { columns } from './table/columns';

	const { data } = $props();
</script>

<UsersTable data={data.users} {columns} />
