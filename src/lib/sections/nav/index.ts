import type { ComponentType } from 'svelte';
import AppSidebar from './app-sidebar.svelte';
import NavigationBreadcrumbs from './navigation-breadcrumbs.svelte';
import NavigationProgressBar from './navigation-progress-bar.svelte';

interface NavItemProps {
	label: string;
	action: string | VoidFunction;
	icon: ComponentType;
	hidden?: boolean;
}

export { AppSidebar, NavigationBreadcrumbs, NavigationProgressBar, type NavItemProps };
