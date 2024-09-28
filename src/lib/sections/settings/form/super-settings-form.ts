import { onSuperFormError } from '$lib/utils/super-form';
import { superForm, type Infer, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import type { ZodObject, ZodRawShape } from 'zod';

export const superSettingsForm = <T extends ZodObject<ZodRawShape>>(
	data: SuperValidated<Infer<T>>,
	schema: T
): SuperForm<Infer<T>> =>
	superForm(data, {
		validators: zodClient(schema),
		onError: onSuperFormError
	});
