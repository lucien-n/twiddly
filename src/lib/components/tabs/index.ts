import Tabs from './tabs.svelte';

interface TabsProps<T extends string> {
	tabs: TabProps<T>[];
	current: T;
	class?: string;
}

interface TabProps<T extends string> {
	label: string;
	href: string;
	value: T;
}

export { Tabs, type TabsProps, type TabProps };
