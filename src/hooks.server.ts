import { sequence } from '@sveltejs/kit/hooks';
import { handleAuth } from './hooks/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = sequence(handleAuth);
