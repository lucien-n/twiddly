import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '&/ui/data-table';
import type { DataUser } from './types';
import { EmailCell, ActionsCell } from './table/cells';

export const columns: ColumnDef<DataUser>[] = [
	{ accessorKey: 'id', header: 'ID' },
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) =>
			renderComponent(EmailCell, {
				email: row.original.email,
				emailVerified: row.original.emailVerified
			})
	},
	{ accessorKey: 'displayName', header: 'Display Name' },
	{ accessorKey: 'handle', header: 'Handle' },
	{ accessorKey: 'role', header: 'Role' },
	{
		id: 'actions',
		cell: ({ row }) => renderComponent(ActionsCell, row.original)
	}
];
