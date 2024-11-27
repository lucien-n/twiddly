import { getModeWatcherThemeMode, getModeWatcherThemeColor } from '../theme';
import { ThemeMode, ThemeColor } from '@prisma/client';

describe('getModeWatcherThemeMode', () => {
	it.each([
		{ themeMode: ThemeMode.DARK, expectedResult: 'dark' },
		{ themeMode: ThemeMode.LIGHT, expectedResult: 'light' },
		{ themeMode: ThemeMode.SYSTEM, expectedResult: 'system' },
		{ themeMode: undefined, expectedResult: 'light' }
	])('returns $expectedResult when themeMode is $themeMode', ({ themeMode, expectedResult }) => {
		expect(getModeWatcherThemeMode(themeMode)).toBe(expectedResult);
	});
});

describe('getModeWatcherThemeColor', () => {
	it.each([
		{ themeColor: ThemeColor.DEFAULT, expectedResult: 'default' },
		{ themeColor: ThemeColor.GREEN, expectedResult: 'green-theme' },
		{ themeColor: ThemeColor.VIOLET, expectedResult: 'violet-theme' },
		{ themeColor: ThemeColor.ROSE, expectedResult: 'rose-theme' },
		{ themeColor: undefined, expectedResult: 'default' }
	])('returns $expectedResult when themeColor is $themeColor', ({ themeColor, expectedResult }) => {
		expect(getModeWatcherThemeColor(themeColor)).toBe(expectedResult);
	});
});
