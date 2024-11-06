import type { Twiddle } from '$lib';
import { route } from '$lib/ROUTES';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { fetcher } from '$lib/utils/fetcher';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';

export class TwiddleState {
	data: Twiddle['data'] = $state() as Twiddle['data'];
	setTwiddleForm: Twiddle['setTwiddleForm'] = $state() as Twiddle['setTwiddleForm'];
	setCommentForm: Twiddle['setCommentForm'] = $state() as Twiddle['setCommentForm'];

	openSetDialog: boolean = $state(false);
	openDeleteDialog: boolean = $state(false);
	openShareDialog: boolean = $state(false);

	deleted: boolean = $state(false);

	constructor({ data, setTwiddleForm, setCommentForm }: Twiddle) {
		this.data = data;
		this.setTwiddleForm = setTwiddleForm;
		this.setCommentForm = setCommentForm;
	}

	async toggleLike() {
		const initialState = this.data.isLiked;
		this.data.isLiked = !initialState;
		const url = initialState
			? route('POST /api/v1/twiddle/[id]/unlike', { id: this.data.id })
			: route('POST /api/v1/twiddle/[id]/like', { id: this.data.id });

		const { data, error, errorBody } = await fetcher<number>(url, 'POST');

		if (errorBody && typeof errorBody === 'object' && 'message' in errorBody) {
			if (errorBody.message === AuthErrorCode.AuthRequired) {
				toast.warning('You must be signed-in');
				return;
			}
		}

		if (error) {
			this.data.isLiked = initialState;
			toast.error(error);
			return;
		}

		if (data !== undefined) {
			this.data.likeCount = data;
		}
	}

	async delete() {
		const url = route('POST /api/v1/twiddle/[id]/delete', { id: this.data.id });
		const { data, error } = await fetcher<boolean>(url, 'POST');

		if (error) {
			toast.error(error);
			return;
		}

		if (data) {
			this.deleted = data;
			toast.success('Twiddle deleted successfully!');
		}
	}
}

const CTX = Symbol('twiddle_ctx');

export const getTwiddleState = () => getContext<TwiddleState>(CTX);

export const setTwiddleState = (twiddle: Twiddle): TwiddleState =>
	setContext<TwiddleState>(CTX, new TwiddleState(twiddle));
