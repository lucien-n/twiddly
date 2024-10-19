import type { RequestHandler } from '@sveltejs/kit';

const security = `Contact: mailto:security@twiddly.dev
Expires: 2027-10-18T22:00:00.000Z
Preferred-Languages: en, fr
Canonical: https://twiddly.dev/.well-known/security.txt`;

export const GET: RequestHandler = () => new Response(security);
