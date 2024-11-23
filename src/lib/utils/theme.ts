import { ThemeColor, ThemeMode } from '@prisma/client';

export const getModeWatcherThemeMode = (theme?: ThemeMode): 'dark' | 'light' | 'system' => {
	switch (theme) {
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

export const getModeWatcherThemeColor = (theme?: ThemeColor): (typeof colorThemes)[number] => {
	switch (theme) {
		case ThemeColor.DEFAULT:
			return 'default';
		case ThemeColor.GREEN:
			return 'green-theme';
		case ThemeColor.VIOLET:
			return 'violet-theme';
	}

	return 'default';
};
