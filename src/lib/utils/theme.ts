import { ThemeColor, ThemeMode } from '@prisma/client';

export const getModeWatcherThemeMode = (themeMode?: ThemeMode): 'dark' | 'light' | 'system' => {
	switch (themeMode) {
		case ThemeMode.DARK:
			return 'dark';
		case ThemeMode.LIGHT:
			return 'light';
		case ThemeMode.SYSTEM:
			return 'system';
	}

	return 'light';
};

export const colorThemes = ['default', 'green-theme', 'violet-theme'] as const;

export const getModeWatcherThemeColor = (themeColor?: ThemeColor): (typeof colorThemes)[number] => {
	switch (themeColor) {
		case ThemeColor.DEFAULT:
			return 'default';
		case ThemeColor.GREEN:
			return 'green-theme';
		case ThemeColor.VIOLET:
			return 'violet-theme';
	}

	return 'default';
};
