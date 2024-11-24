import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetcher } from '../fetcher';

describe('fetcher', () => {
	const mockFetch = vi.fn();
	global.fetch = mockFetch;

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should return data when the response is successful', async () => {
		const mockResponse = {
			data: { key: 'value' }
		};
		const mUrl = 'https://example.com';
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse
		});

		const result = await fetcher<typeof mockResponse.data>(mUrl);

		expect(result).toEqual({ data: mockResponse.data });
		expect(mockFetch).toHaveBeenCalledWith(mUrl, { method: undefined });
	});

	it('should return error and errorBody when the response is not ok', async () => {
		const mockErrorResponse = {
			error: 'An error occurred'
		};
		const mUrl = 'https://example.com';
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: async () => mockErrorResponse
		});

		const result = await fetcher(mUrl);

		expect(result).toEqual({
			error: mockErrorResponse.error,
			errorBody: mockErrorResponse
		});
		expect(mockFetch).toHaveBeenCalledWith(mUrl, { method: undefined });
	});

	it('should return default error message if error is not provided in error body', async () => {
		const mockErrorResponse = {};
		const mUrl = 'https://example.com';
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: async () => mockErrorResponse
		});

		const result = await fetcher(mUrl);

		expect(result).toEqual({
			error: 'Something went wrong',
			errorBody: mockErrorResponse
		});
	});

	it('should return network error if fetch throws an error', async () => {
		const mockError = new Error('Network failure');
		const mUrl = 'https://example.com';
		mockFetch.mockRejectedValueOnce(mockError);

		const result = await fetcher(mUrl);

		expect(result).toEqual({
			error: 'Network failure'
		});
	});

	it('should use the provided HTTP method and options', async () => {
		const mockResponse = {
			data: { key: 'value' }
		};
		const mUrl = 'https://example.com';
		const mMethod = 'POST';
		const mHeaders = { 'Content-Type': 'application/json' };

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse
		});

		const result = await fetcher(mUrl, mMethod, {
			headers: mHeaders
		});

		expect(result).toEqual({ data: mockResponse.data });
		expect(mockFetch).toHaveBeenCalledWith(mUrl, {
			method: mMethod,
			headers: mHeaders
		});
	});
});
