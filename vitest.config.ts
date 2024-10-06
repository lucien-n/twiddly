import { defineConfig } from 'vitest/config';
import type { KIT_ROUTES } from '$lib/ROUTES';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [kitRoutes<KIT_ROUTES>(), sveltekit()],
	test: {
		include: ['tests/**/*.test.ts']
	},
	resolve: {
		alias: {
			$tests: './tests',
			$lib: './src/lib'
		}
	}
});
