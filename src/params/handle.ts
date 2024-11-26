import { HANDLES_BLACKLIST } from '@/lib/schemas/auth/fields';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (handle) => !HANDLES_BLACKLIST.includes(handle);
