import type { KIT_ROUTES } from '$lib/ROUTES';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [kitRoutes<KIT_ROUTES>(), sveltekit()],
	ssr: {
		external: ['@prisma/client']
	}
});
