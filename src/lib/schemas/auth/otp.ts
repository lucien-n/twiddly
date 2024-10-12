import { z } from 'zod';
import { otpField } from './fields';

export const otpSchema = z.object({
	otp: otpField
});

export type OTPSchema = typeof otpSchema;
