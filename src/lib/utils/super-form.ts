import type { ActionResult } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

type Data = Record<string, unknown> | undefined;
type ResultSuccess = Data;
type ResultFailure = Data;

export type ActionResultSuccess<Success extends ResultSuccess> = Extract<
	ActionResult<Success>,
	{ type: 'success' }
>;
export type ActionResultFailure<Failure extends ResultFailure> = Extract<
	ActionResult<Failure>,
	{ type: 'failure' }
>;
export type ActionResultRedirect = Extract<ActionResult, { type: 'redirect' }>;
export type ActionResultError = Extract<ActionResult, { type: 'error' }>;

export const handleSuperResult = (
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
		onSuccess?: <Success extends ResultSuccess>(result: ActionResultSuccess<Success>) => void;
		onFailure?: <Failure extends ResultFailure>(result: ActionResultFailure<Failure>) => void;
		onRedirect?: (result: ActionResultRedirect) => void;
		onError?: (result: ActionResultError) => void;
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
