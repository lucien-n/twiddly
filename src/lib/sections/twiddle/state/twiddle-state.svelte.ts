import type { Twiddle } from '$lib/models';
import { route } from '$lib/ROUTES';
import { AuthCode } from '@/lib/utils/auth-code';
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
	liking: boolean = $state(false);

	constructor({ data, setTwiddleForm, setCommentForm }: Twiddle) {
		this.data = data;
		this.setTwiddleForm = setTwiddleForm;
		this.setCommentForm = setCommentForm;
	}

	async toggleLike() {
		const initialState = { liked: this.data.isLiked, likeCount: this.data.likeCount };

		this.data.isLiked = !initialState.liked;
		this.data.likeCount += initialState.liked ? -1 : 1;

		const url = initialState.liked
			? route('POST /api/v1/twiddle/[id]/unlike', { id: this.data.id })
			: route('POST /api/v1/twiddle/[id]/like', { id: this.data.id });

		const { data, error, errorBody } = await fetcher<number>(url, 'POST');

		if (errorBody && typeof errorBody === 'object' && 'message' in errorBody) {
			if (errorBody.message === AuthCode.AuthRequired) {
				toast.warning('You must be signed-in');
			} else {
				toast.error(`An error occured : ${errorBody.message}`);
			}

			this.data.isLiked = initialState.liked;
			this.data.likeCount = initialState.likeCount;

			return;
		}

		if (error) {
			this.data.isLiked = initialState.liked;
			this.data.likeCount = initialState.likeCount;

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
