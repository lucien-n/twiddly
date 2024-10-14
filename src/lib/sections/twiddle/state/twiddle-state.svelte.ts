import { route } from '$lib/ROUTES';
import type { SetTwiddlechema } from '$lib/schemas/twiddle/set-twiddle';
import { fetcher } from '$lib/utils/fetcher';
import type { Like, Profile, Twiddle } from '@prisma/client';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import type { Infer, SuperValidated } from 'sveltekit-superforms';

export type TwiddleData = Pick<
	Twiddle,
	'id' | 'editedAt' | 'content' | 'likeCount' | 'createdAt'
> & {
	author: Pick<Profile, 'id' | 'handle' | 'displayName' | 'avatarBackgroundColor' | 'role'>;
} & {
	likes: Pick<Like, 'profileId'>[];
};

type SetTwiddleForm = SuperValidated<Infer<SetTwiddlechema>>;

export interface TwiddleStateInit {
	data: TwiddleData;
	setTwiddleForm: SetTwiddleForm;
}

export class TwiddleState {
	data: TwiddleData = $state() as TwiddleData;
	setTwiddleForm: SetTwiddleForm = $state() as SetTwiddleForm;

	openSetDialog: boolean = $state(false);
	openDeleteDialog: boolean = $state(false);
	openShareDialog: boolean = $state(false);

	deleted: boolean = $state(false);
	edited: boolean = $state(false);
	liked: boolean = $state(false);
	likes: number = $state(0);

	constructor({ data, setTwiddleForm }: TwiddleStateInit) {
		this.data = data;
		this.setTwiddleForm = setTwiddleForm;
		this.likes = data.likeCount;
		this.liked = data.likes.length > 0;
		this.edited = !!data.editedAt;
	}

	async toggleLike() {
		const url = this.liked
			? route('POST /api/v1/twiddle/[id]/unlike', { id: this.data.id })
			: route('POST /api/v1/twiddle/[id]/like', { id: this.data.id });

		const { data, error } = await fetcher<number>(url, 'POST');

		if (error) {
			toast.error(error);
			return;
		}

		if (data !== undefined) {
			this.likes = data;
			this.liked = !this.liked;
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
