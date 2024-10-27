export interface ApiResponse<T> {
	data?: T;
	error?: string;
	errorBody?: unknown;
}

export const fetcher = async <T>(
	url: string,
	method?: RequestInit['method'],
	options: Omit<RequestInit, 'method'> = {}
): Promise<ApiResponse<T>> => {
	try {
		const res = await fetch(url, { method, ...options });

		if (!res.ok) {
			const errorBody = (await res.json()) as ApiResponse<T>;
			return {
				error: errorBody.error || 'Something went wrong',
				errorBody
			};
		}

		const body = (await res.json()) as ApiResponse<T>;
		return {
			data: body.data
		};
	} catch (error) {
		console.error('Fetch error:', error);

		return {
			error: (error as Error).message || 'Network error'
		};
	}
};
