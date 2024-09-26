import type { ControlAttrs } from 'formsnap';
import Select from './select.svelte';
import ColorSelect from './color-select.svelte';

type SelectOption<T extends string> = {
	label: string;
	value: T;
};

type ColorSelectOption<T extends string> = SelectOption<T> & {
	color: string;
};

interface SelectProps<T extends string> {
	selectedOption: T;
	options: SelectOption<T>[];
	attrs: ControlAttrs;
}

type ColorSelectProps<T extends string> = SelectProps<T> & {
	options: ColorSelectOption<T>[];
};

export {
	Select,
	ColorSelect,
	type ColorSelectOption,
	type ColorSelectProps,
	type SelectOption,
	type SelectProps
};
