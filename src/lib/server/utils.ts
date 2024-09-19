export const handlerRedirect = (status: number, location: string) =>
	new Response(null, {
		status,
		headers: { location }
	});
