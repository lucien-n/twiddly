import type { ControlAttrs } from 'formsnap';
import Select from './select.svelte';
import type { Snippet } from 'svelte';

type SelectOption<T extends string> = {
	label: string;
	value: T;
	color?: string;
};

interface Props<T extends string> {
	selectedOption: T;
	options: SelectOption<T>[];
	attrs: ControlAttrs;
}

export { Select, type SelectOption, type Props as SelectProps };
