import type { ControlAttrs } from 'formsnap';
import PasswordInput from './password-input.svelte';

type PasswordInputProps = ControlAttrs & {
	value?: string;
	showPassword?: boolean;
};

export { PasswordInput, type PasswordInputProps };
