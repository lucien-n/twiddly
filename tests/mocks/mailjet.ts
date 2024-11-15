import { vi } from 'vitest';

export const mMailjetPostRequest = vi.fn();

export const mMailjet = {
	post: vi.fn()
};

vi.mock('$lib/server/mailjet', () => ({ mailjet: mMailjet }));
