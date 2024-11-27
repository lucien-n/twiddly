import { AvatarBackgroundColor } from '@prisma/client';
import { getAvatarURLParams } from '../dicebear-notionists-neutral';

describe('getAvatarURLParams', () => {
	it('should return URLSearchParams with seed when given seed parameter', () => {
		const params = { seed: 'testSeed' };
		const result = getAvatarURLParams(params);

		expect(result.toString()).toBe('seed=testSeed');
	});

	it('should return URLSearchParams with backgroundType when given backgroundType', () => {
		const params = { backgroundType: 'gradientLinear' } as const;
		const result = getAvatarURLParams(params);

		expect(result.toString()).toBe('backgroundType=gradientLinear');
	});

	it('should return URLSearchParams with backgroundRotation when given backgroundRotation', () => {
		const params = { backgroundRotation: 45 };
		const result = getAvatarURLParams(params);

		expect(result.toString()).toBe('backgroundRotation=45');
	});

	it('should return URLSearchParams with backgroundColor as string when given single backgroundColor', () => {
		const params = { backgroundColor: 'transparent' };
		const result = getAvatarURLParams(params);

		expect(result.toString()).toBe('backgroundColor=transparent');
	});

	it('should return URLSearchParams with backgroundColor as comma-separated list when given an array of backgroundColors', () => {
		const params = { backgroundColor: ['transparent', 'LIGTH_BLUE'] };
		const result = getAvatarURLParams(params);

		expect(result.toString()).toBe('backgroundColor=transparent%2CLIGTH_BLUE');
	});

	it('should handle mixed backgroundColor types correctly', () => {
		const params = {
			backgroundColor: [AvatarBackgroundColor.LAVENDER, 'transparent']
		};
		const result = getAvatarURLParams(params);

		expect(result.toString()).toBe('backgroundColor=LAVENDER%2Ctransparent');
	});

	it('should return URLSearchParams with multiple parameters', () => {
		const params = {
			seed: 'testSeed',
			backgroundColor: 'LIGTH_BLUE',
			backgroundType: 'solid',
			backgroundRotation: 90
		} as const;
		const result = getAvatarURLParams(params);

		expect(result.toString()).toBe(
			'seed=testSeed&backgroundType=solid&backgroundRotation=90&backgroundColor=LIGTH_BLUE'
		);
	});
});
