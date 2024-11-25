export const copyToClipboard = (
	text: string,
	onSuccess: (message: string, value: unknown) => void = () => undefined,
	onError: (message: string, reason: string) => void = () => undefined
) => {
	navigator.clipboard.writeText(text).then(
		(value) => onSuccess(`Successfully copied "${text}" to your clipboard`, value),
		(reason) => onError(`Error while copying "${text}" to your clipboard`, reason)
	);
};

export const getSanitizedContentLength = (sanitizedContent: string) =>
	sanitizedContent.split('\n').join('').length;

export const sanitizeTwiddleContent = (content: string): string => {
	const formatted = content
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n');

	return formatted;
};

export const calculatePercentage = (value: number, max: number) => Math.floor((value / max) * 100);

export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date);
