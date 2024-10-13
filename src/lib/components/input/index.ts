import type { ControlAttrs } from 'formsnap';
import PasswordInput from './password-input.svelte';
import OTPInput from './otp-input.svelte';

interface PasswordInputProps {
	value?: string;
	showPassword?: boolean;
	attrs?: ControlAttrs;
}

interface OTPInputProps {
	value?: string;
	attrs?: ControlAttrs;
}

export { PasswordInput, OTPInput, type PasswordInputProps, type OTPInputProps };
