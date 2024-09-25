import { toast } from 'svelte-sonner';
import { superForm, type Infer, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import type { ZodObject } from 'zod';

export const superSettingsForm = <T extends ZodObject<any>>(
	data: SuperValidated<Infer<T>>,
	schema: T
): SuperForm<Infer<T>> =>
	superForm(data, {
		validators: zodClient(schema),
		onError: ({ result }) => toast.error(result.error.message)
	});
