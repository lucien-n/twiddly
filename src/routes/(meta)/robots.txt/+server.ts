import type { RequestHandler } from '@sveltejs/kit';

const robots = `User-agent: *
Disallow:

Disallow: /admin
Disallow: /settings
Disallow: /profile
Disallow: /api

Disallow: /*?*

Sitemap: https://twiddly.dev/sitemap.xml`;

export const GET: RequestHandler = () => new Response(robots);
