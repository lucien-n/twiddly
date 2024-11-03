import type { ControlAttrs } from 'formsnap';
import SingleSelect from './single-select.svelte';
import ColorSelect from './color-select.svelte';

type SelectOption<T extends string> = {
	label: string;
	value: T;
};

type ColorSelectOption<T extends string> = SelectOption<T> & {
	color: string;
};

type SingleSelectOption<T extends string> = SelectOption<T> & {
	description?: string;
};

type SingleSelectProps<T extends string> = ControlAttrs & {
	value: T;
	options: SingleSelectOption<T>[];
	placeholder?: string;
};

type ColorSelectProps<T extends string> = SingleSelectProps<T> & {
	options: ColorSelectOption<T>[];
};

export {
	SingleSelect,
	ColorSelect,
	type ColorSelectOption,
	type ColorSelectProps,
	type SelectOption,
	type SingleSelectOption,
	type SingleSelectProps
};
