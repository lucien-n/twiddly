import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [kitRoutes(), sveltekit()],
	test: {
		include: ['tests/src/**/*.test.ts'],
		coverage: {
			all: false
		}
	},
	resolve: {
		alias: {
			$tests: './tests',
			$lib: './src/lib'
		}
	}
});
