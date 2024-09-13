import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export interface NavItemProps {
	label: string;
	icon: ComponentType<Icon>;
	hidden?: boolean;
	action: string | (() => void);
}
