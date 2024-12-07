import type { KIT_ROUTES } from '$lib/ROUTES';
import { sveltekit } from '@sveltejs/kit/vite';
import { createRequire } from 'module';
import path from 'path';
import { defineConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

const require = createRequire(import.meta.url);
const prismaClientDirectory = path.normalize(
	path.relative(
		process.cwd(),
		require.resolve('@prisma/client').replace(/@prisma(\/|\\)client(\/|\\).*/, '.prisma/client')
	)
);
const prismaIndexBrowserPath = path.join(prismaClientDirectory, 'index-browser.js');

export default defineConfig({
	plugins: [
		kitRoutes<KIT_ROUTES>({
			PAGES: {
				'/': {
					explicit_search_params: {
						tab: { type: '"discover" | "following"' }
					}
				}
			}
		}),
		sveltekit()
	],
	resolve: {
		alias: {
			'.prisma/client/index-browser': prismaIndexBrowserPath
		}
	},
	optimizeDeps: {
		exclude: ['@node-rs/argon2', '@node-rs/bcrypt']
	}
});
