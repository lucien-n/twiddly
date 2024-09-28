import type { ActionResult } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export const handleResult = (
	event: {
		result: ActionResult;
		formElement: HTMLFormElement;
		cancel: () => void;
	},
	{
		onSuccess,
		onFailure,
		onError,
		onRedirect
	}: {
		onSuccess?: (result: ActionResult) => void;
		onFailure?: (result: ActionResult) => void;
		onRedirect?: (result: ActionResult) => void;
		onError?: (result: ActionResult) => void;
	}
) => {
	const result = event.result;

	switch (result.type) {
		case 'success':
			return onSuccess?.(result);
		case 'failure':
			return onFailure?.(result);
		case 'redirect':
			return onRedirect?.(result);
		case 'error':
			return onError?.(result);
	}
};

export const onSuperFormError = (event: {
	result: {
		type: 'error';
		status?: number;
		error:
			| App.Error
			| Error
			| {
					message: string;
			  };
	};
}) => {
	toast.error(event.result.error.message);
};
