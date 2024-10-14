import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutServerLoad } from './$types';
import { setTwiddleSchema } from '$lib/schemas/twiddle/set-twiddle';
import { superValidate } from 'sveltekit-superforms';

export const load: LayoutServerLoad = async () => ({
	setTwiddleForm: await superValidate(zod(setTwiddleSchema))
});
