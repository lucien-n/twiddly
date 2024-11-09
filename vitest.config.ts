import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [kitRoutes(), sveltekit()],
	test: {
		include: ['tests/src/**/*.test.ts'],
		exclude: ['src/lib/ROUTES.ts'],
		coverage: {
			all: false,
			include: ['src/lib/server/auth.ts'],
			exclude: ['src/lib/ROUTES.ts', 'tests/']
		}
	},
	resolve: {
		alias: {
			$tests: './tests',
			$lib: './src/lib'
		}
	}
});
