export const generateHandle = (displayName: string): string =>
	displayName
		.replace(/[^a-zA-Z0-9_]/g, '_')
		.replace(/_+/g, '_')
		.toLowerCase();
