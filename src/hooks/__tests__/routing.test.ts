import { handlerRedirect } from '$lib/server/utils';
import { MaintenanceMode, Role } from '@prisma/client';
import { error, type RequestEvent } from '@sveltejs/kit';
import { handleRouting, isInRoute } from '../routing';

const mResolve = vi.fn();

vi.mock('@sveltejs/kit', () => ({
	error: vi.fn()
}));

vi.mock('$lib/server/utils', async (importOriginal) => {
	const original = await importOriginal();
	return {
		...(original as object),
		handlerRedirect: vi.fn()
	};
});

describe('isInRoute', () => {
	const mRoutes = ['/sign-in', '/sign-up?/default'];

	it.each([
		{
			pathname: '/sign-in',
			expectedReturn: true
		},
		{
			pathname: '/sign-up',
			expectedReturn: true
		},
		{
			pathname: '/sign-in?/default',
			expectedReturn: false
		}
	])('should return expectedReturn %o', ({ pathname, expectedReturn }) => {
		const result = isInRoute({ url: { pathname } } as RequestEvent, mRoutes);

		expect(result).toEqual(expectedReturn);
	});
});

describe('handleRouting', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('beforeAuth', () => {
		it('should go through pre auth routing', async () => {
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.OPEN
					}
				}
			} as RequestEvent;

			await handleRouting.beforeAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(1);
			expect(mResolve).toHaveBeenCalledWith(mEvent);
		});

		it('should error if site is closed', async () => {
			const mError = vi.mocked(error);
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.LOCKED
					}
				}
			} as RequestEvent;

			await handleRouting.beforeAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mError).toHaveBeenCalledTimes(1);
			expect(mError).toHaveBeenCalledWith(503, 'Twiddly is under maintenance.');
		});
	});

	describe('afterAuth', () => {
		it('should go through post auth routing', async () => {
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.OPEN
					}
				},
				url: { pathname: '/' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(1);
			expect(mResolve).toHaveBeenCalledWith(mEvent);
		});

		it('should redirect to sign-in if site is accessible to verified users only and current user is not', async () => {
			const mHandlerRedirect = vi.mocked(handlerRedirect);
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.VERIFIED
					},
					user: {
						emailVerified: false
					}
				},
				url: { pathname: '/' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(0);
			expect(mHandlerRedirect).toHaveBeenCalledTimes(1);
			expect(mHandlerRedirect).toHaveBeenCalledWith(307, '/sign-in');
		});

		it('should go through post auth if site is accessible to verified users only and current user is', async () => {
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.VERIFIED
					},
					user: {
						emailVerified: true
					}
				},
				url: { pathname: '/' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(1);
			expect(mResolve).toHaveBeenCalledWith(mEvent);
		});

		it('should redirect to sign-in if site is accessible to admin users only and current user is not', async () => {
			const mHandlerRedirect = vi.mocked(handlerRedirect);
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.ADMIN
					},
					profile: {
						role: Role.USER
					}
				},
				url: { pathname: '/' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(0);
			expect(mHandlerRedirect).toHaveBeenCalledTimes(1);
			expect(mHandlerRedirect).toHaveBeenCalledWith(307, '/sign-in');
		});

		it('should go through post auth if site is accessible to admin users only and current user is', async () => {
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.ADMIN
					},
					profile: {
						role: Role.ADMIN
					}
				},
				url: { pathname: '/' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(1);
			expect(mResolve).toHaveBeenCalledWith(mEvent);
		});

		it('should go through post auth if site is not locked and user is in sign-in route', async () => {
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.ADMIN
					}
				},
				url: { pathname: '/sign-in' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(1);
			expect(mResolve).toHaveBeenCalledWith(mEvent);
		});

		it('should redirect to home if user tries to access admin page', async () => {
			const mHandlerRedirect = vi.mocked(handlerRedirect);
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.OPEN
					},
					profile: {
						role: Role.RESTRICTED
					}
				},
				url: { pathname: '/admin' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(0);
			expect(mHandlerRedirect).toHaveBeenCalledTimes(1);
			expect(mHandlerRedirect).toHaveBeenCalledWith(303, '/');
		});

		it('should redirect to home if user tries to access admin api endpoint', async () => {
			const mHandlerRedirect = vi.mocked(handlerRedirect);
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.OPEN
					},
					profile: {
						role: Role.USER
					}
				},
				url: { pathname: '/api/v1/admin' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(0);
			expect(mHandlerRedirect).toHaveBeenCalledTimes(1);
			expect(mHandlerRedirect).toHaveBeenCalledWith(303, '/');
		});

		it('should go through post auth if admin tries to access admin page', async () => {
			const mEvent = {
				locals: {
					siteSettings: {
						maintenanceMode: MaintenanceMode.OPEN
					},
					profile: {
						role: Role.ADMIN
					}
				},
				url: { pathname: '/admin' }
			} as RequestEvent;

			await handleRouting.afterAuth({
				resolve: mResolve,
				event: mEvent
			});

			expect(mResolve).toHaveBeenCalledTimes(1);
			expect(mResolve).toHaveBeenCalledWith(mEvent);
		});
	});
});
