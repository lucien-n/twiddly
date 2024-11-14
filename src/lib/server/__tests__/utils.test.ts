import { describe, it, expect } from 'vitest';
import { getMaintenanceMode, handlerRedirect } from '../utils';
import { MaintenanceMode } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

describe('handlerRedirect', () => {
	it('should return a redirect response', () => {
		const mStatus = 201;
		const mKey = '/';

		const result = handlerRedirect(mStatus, mKey);

		expect(result).toEqual(new Response(null, { status: mStatus, headers: { location: mKey } }));
	});
});

describe('getMaintenanceMode', () => {
	it.each([
		{
			siteSettings: { maintenanceMode: MaintenanceMode.OPEN },
			expectedReturn: MaintenanceMode.OPEN
		},
		{ siteSettings: null, expectedReturn: MaintenanceMode.ADMIN }
	])('should return maintenance mode %o', ({ siteSettings, expectedReturn }) => {
		const result = getMaintenanceMode({ locals: { siteSettings } } as RequestEvent);

		expect(result).toEqual(expectedReturn);
	});
});
