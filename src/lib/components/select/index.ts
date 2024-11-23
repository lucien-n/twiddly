import type { ControlAttrs } from 'formsnap';
import SingleSelect from './single-select.svelte';
import ColorSelect from './color-select.svelte';
import type { SelectTriggerProps } from 'bits-ui';

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

type SingleSelectProps<T extends string> = Partial<ControlAttrs> &
	SelectTriggerProps & {
		value: T;
		options: SingleSelectOption<T>[];
		placeholder?: string;
		onValueChange?: (value: string) => void;
	};

type ColorSelectProps<T extends string> = Pick<
	SingleSelectProps<T>,
	'value' | 'options' | 'placeholder' | 'onValueChange'
> & {
	options: ColorSelectOption<T>[];
	class?: string;
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
