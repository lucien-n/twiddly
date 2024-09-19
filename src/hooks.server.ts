import { sequence } from '@sveltejs/kit/hooks';
import { handleAuth } from './hooks/auth';
import type { Handle } from '@sveltejs/kit';
import { handleRouting } from './hooks/routing';

export const handle: Handle = sequence(handleAuth, handleRouting);
