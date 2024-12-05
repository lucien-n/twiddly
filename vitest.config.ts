import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [kitRoutes(), sveltekit()],
	test: {
		include: ['src/**/*.test.ts'],
		exclude: ['src/lib/ROUTES.ts'],
		coverage: {
			all: false,
			exclude: ['src/lib/ROUTES.ts', 'tests/', '**/__tests__', '**/*.test.ts']
		},
		globalSetup: './vitest.global-setup.ts',
		globals: true
	},
	resolve: {
		alias: {
			$tests: './tests',
			$lib: './src/lib'
		}
	}
});
