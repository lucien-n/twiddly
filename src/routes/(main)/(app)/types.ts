export const homeTabs = ['discover', 'following'];
export type HomeTab = (typeof homeTabs)[number];

export const getTabFromParam = (param: string | null): HomeTab => {
	const tabParam = param?.toString();
	return tabParam && homeTabs.includes(tabParam) ? tabParam : 'discover';
};
