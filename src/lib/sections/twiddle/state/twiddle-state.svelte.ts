import type { Twiddle } from '$lib';
import { route } from '$lib/ROUTES';
import type { SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { fetcher } from '$lib/utils/fetcher';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import type { Infer, SuperValidated } from 'sveltekit-superforms';

type SetTwiddleForm = SuperValidated<Infer<SetTwiddlechema>>;

export interface TwiddleStateInit {
	data: Twiddle;
	setTwiddleForm: SetTwiddleForm;
}

export class TwiddleState {
	data: Twiddle = $state() as Twiddle;
	setTwiddleForm: SetTwiddleForm = $state() as SetTwiddleForm;

	openSetDialog: boolean = $state(false);
	openDeleteDialog: boolean = $state(false);
	openShareDialog: boolean = $state(false);

	deleted: boolean = $state(false);

	constructor({ data, setTwiddleForm }: TwiddleStateInit) {
		this.data = data;
		this.setTwiddleForm = setTwiddleForm;
	}

	async toggleLike() {
		const url = this.data.isLiked
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
			toast.error(error);
			return;
		}

		if (data !== undefined) {
			this.data.likeCount = data;
			this.data.isLiked = !this.data.isLiked;
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

export const setTwiddleState = (init: TwiddleStateInit): TwiddleState => {
	const twiddleState = new TwiddleState(init);
	setContext<TwiddleState>(CTX, twiddleState);
	return twiddleState;
};
