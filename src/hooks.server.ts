import { sequence } from '@sveltejs/kit/hooks';
import { handleAuth } from './hooks/auth';
import type { Handle } from '@sveltejs/kit';
import { handleRouting } from './hooks/routing';
import { handlePreRouting } from './hooks/pre-routing';

export const handle: Handle = sequence(handlePreRouting, handleAuth, handleRouting);
