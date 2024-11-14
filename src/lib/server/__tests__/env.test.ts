import { beforeEach, describe, expect, it, vi } from 'vitest';

const mMJ_APIKEY_PUBLIC = 'devCredentials';
const mMJ_APIKEY_PRIVATE = 'devCredentials';

vi.mock('$env/static/private', () => ({
	MJ_APIKEY_PUBLIC: mMJ_APIKEY_PUBLIC,
	MJ_APIKEY_PRIVATE: mMJ_APIKEY_PRIVATE
}));

vi.mock('node-mailjet', () => ({
	default: vi.fn().mockImplementation(() => ({}))
}));

describe('Mailjet instantiation in test environment', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('should instantiate Mailjet with test credentials in test environment', async () => {
		process.env.NODE_ENV = 'test';
		await import('../mailjet');

		const MailJet = (await import('node-mailjet')).default;

		expect(MailJet).toHaveBeenCalledWith({
			apiKey: 'test',
			apiSecret: 'test'
		});
	});

	it('should instantiate Mailjet with valid credentials in any other environment', async () => {
		process.env.NODE_ENV = 'dev';
		await import('../mailjet');

		const MailJet = (await import('node-mailjet')).default;

		expect(MailJet).toHaveBeenCalledWith({
			apiKey: mMJ_APIKEY_PUBLIC,
			apiSecret: mMJ_APIKEY_PRIVATE
		});
	});
});
