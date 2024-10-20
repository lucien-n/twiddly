import { vi } from 'vitest';

export const mGetMaintenanceMode = vi.fn();

vi.mock('$lib/server/utils', () => ({
	getMaintenanceMode: mGetMaintenanceMode
}));
