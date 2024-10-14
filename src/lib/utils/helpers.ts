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
