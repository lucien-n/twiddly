import Dropdown from './dropdown.svelte';
import type { Snippet } from 'svelte';

type DropdownItem = {
	item: string | Snippet;
	onclick: () => void;
};

interface Props {
	children: Snippet;
	items: DropdownItem[];
}

export { Dropdown, type DropdownItem, type Props as DropdownProps };