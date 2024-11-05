<script lang="ts">
	import { Input } from '&/ui/input';
	import { SingleSelect } from '&/select';
	import { Role } from '@prisma/client';
	import { Label } from '&/ui/label';
	import type { Table } from '@tanstack/table-core';
	import type { DataUser } from '../types';

	interface Props {
		table: Table<DataUser>;
		search: string | undefined;
		emailVerified: 'true' | 'false' | '';
	}
	let { table, search = $bindable(), emailVerified = $bindable() }: Props = $props();
</script>

<div class="flex items-center gap-3 py-4">
	<section class="w-full max-w-sm">
		<Label for="search">Search</Label>
		<Input id="search" placeholder="John Doe, johndoe, john@mail.com" bind:value={search} />
	</section>
	<section class="w-full max-w-xs">
		<Label for="role">Role</Label>
		<SingleSelect
			id="role"
			placeholder="Role"
			value={(table.getColumn('role')?.getFilterValue() as string) ?? ''}
			onValueChange={(value) => table.getColumn('role')?.setFilterValue(value)}
			options={Object.keys(Role).map((role) => ({
				label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
				value: role
			}))}
		/>
	</section>
	<section class="w-full max-w-xs">
		<Label for="email-verification-status">Email Verification Status</Label>
		<SingleSelect
			id="email-verification-status"
			placeholder="Email Verification Status"
			bind:value={emailVerified}
			options={[
				{
					label: 'Verified',
					value: 'true'
				},
				{
					label: 'Unverified',
					value: 'false'
				}
			]}
		/>
	</section>
</div>
