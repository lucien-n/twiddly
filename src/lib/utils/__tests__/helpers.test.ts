import {
	calculatePercentage,
	copyToClipboard,
	formatDate,
	getSanitizedContentLength,
	sanitizeTwiddleContent
} from '../helpers';

describe('copyToClipboard', () => {
	const mWriteText = vi.fn();
	Object.assign(navigator, {
		clipboard: {
			writeText: mWriteText
		}
	});

	it('should copy to clipboard', async () => {
		const mContent = 'to copy';
		mWriteText.mockResolvedValue(mContent);

		copyToClipboard(mContent);

		expect(mWriteText).toHaveBeenCalledWith(mContent);
	});
});

describe('getSanitizedContentLength', () => {
	it("should return the content's length", () => {
		const mContent = 'Hello,\nworld\n!';

		const result = getSanitizedContentLength(mContent);

		expect(result).toEqual(12);
	});
});

describe('sanitizeTwiddleContent', () => {
	it('should sanitize content', () => {
		const mContent = 'Hello,   \nworld \n!  ';

		const result = sanitizeTwiddleContent(mContent);

		expect(result).toEqual('Hello,\nworld\n!');
	});
});

describe('calculatePercentage', () => {
	it.each([
		{
			value: 10,
			max: 50,
			expectedResult: 20
		},
		{
			value: 10.5,
			max: 50,
			expectedResult: 21
		},
		{
			value: 9.99,
			max: 10,
			expectedResult: 99
		}
	])('should return floored percentage', ({ value, max, expectedResult }) => {
		const result = calculatePercentage(value, max);

		expect(result).toEqual(expectedResult);
	});
});

describe('formatDate', () => {
	it('should return formatted date', () => {
		const mDate = new Date('6-12-2020 22:17');

		const result = formatDate(mDate);

		expect(result).toEqual('Jun 12, 2020, 10:17 PM');
	});
});
