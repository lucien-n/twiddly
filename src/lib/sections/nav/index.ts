import type { ComponentType } from 'svelte';
import AppSidebar from './app-sidebar.svelte';

interface NavItemProps {
	label: string;
	action: string | VoidFunction;
	icon: ComponentType;
	hidden?: boolean;
}

export { AppSidebar, type NavItemProps };
