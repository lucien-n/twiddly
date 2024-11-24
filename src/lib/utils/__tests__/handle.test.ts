import { describe, expect, it } from 'vitest';
import { generateHandle } from '../handle';

describe('generateHandle', () => {
	it.each([
		{ displayName: 'John Doe', expectedResult: 'john_doe' },
		{ displayName: 'Jane-Doe', expectedResult: 'jane_doe' },
		{ displayName: 'User123', expectedResult: 'user123' },
		{ displayName: 'Hello@World!', expectedResult: 'hello_world_' },
		{ displayName: 'Multiple___Underscores', expectedResult: 'multiple_underscores' },
		{ displayName: '!!Special$$Chars##', expectedResult: '_special_chars_' },
		{ displayName: 'Already_lowercase', expectedResult: 'already_lowercase' },
		{ displayName: 'Trailing__Underscores__', expectedResult: 'trailing_underscores_' },
		{ displayName: '____Leading_and_Trailing___', expectedResult: '_leading_and_trailing_' },
		{ displayName: 'OnlySymbols!!!', expectedResult: 'onlysymbols_' },
		{ displayName: '', expectedResult: '' }
	])('transforms "$displayName" into "$expectedResult"', ({ displayName, expectedResult }) => {
		expect(generateHandle(displayName)).toBe(expectedResult);
	});
});
