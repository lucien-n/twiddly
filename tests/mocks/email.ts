import { vi } from 'vitest';

export const mSendOTPVerificationEmail = vi.fn();
vi.mock('$lib/server/email', () => ({
	sendOTPVerificationEmail: (...args: unknown[]) => mSendOTPVerificationEmail(...args)
}));
