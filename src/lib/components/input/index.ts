import type { ControlAttrs } from 'formsnap';
import PasswordInput from './password-input.svelte';
import OTPInput from './otp-input.svelte';

type PasswordInputProps = ControlAttrs & {
	value?: string;
	showPassword?: boolean;
};

type OTPInputProps = ControlAttrs & {
	value?: string;
};

export { PasswordInput, OTPInput, type PasswordInputProps, type OTPInputProps };
