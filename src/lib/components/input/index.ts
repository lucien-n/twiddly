import type { ControlAttrs } from 'formsnap';
import PasswordInput from './password-input.svelte';

interface PasswordInputProps {
	value?: string;
	showPassword?: boolean;
	attrs?: ControlAttrs;
}

export { PasswordInput, type PasswordInputProps };
