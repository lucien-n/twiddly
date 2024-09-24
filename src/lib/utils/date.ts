export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date);
