<script lang="ts">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		getCoreRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { DataUser } from '../types';
	import Fuse from 'fuse.js';
	import UsersTableFilters from './users-table-filters.svelte';

	type DataTableProps<TData> = {
		columns: ColumnDef<TData>[];
		data: TData[];
	};

	let { data, columns }: DataTableProps<DataUser> = $props();

	let columnFilters = $state<ColumnFiltersState>([]);

	const fuse = new Fuse(data, { keys: ['email', 'handle', 'displayName'], distance: 2 });
	let emailVerified: 'true' | 'false' | '' = $state('');
	let search: string | undefined = $state();

	const table = createSvelteTable({
		get data() {
			let finalData = data;

			if (search) {
				finalData = fuse.search(search).map(({ item }) => item);
			}

			if (emailVerified) {
				finalData = finalData.filter((row) => row.emailVerified.toString() === emailVerified);
			}

			return finalData;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		state: {
			get columnFilters() {
				return columnFilters;
			}
		}
	});
</script>

<div>
	<UsersTableFilters {table} bind:search bind:emailVerified />
	<div class="h-full overflow-y-scroll rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
