import { Theme } from '@prisma-app/client';

export const getModeWatcherTheme = (theme?: Theme): 'dark' | 'light' | 'system' => {
	switch (theme) {
		case Theme.DARK:
			return 'dark';
		case Theme.LIGHT:
			return 'light';
		case Theme.SYSTEM:
			return 'system';
	}

	return 'light';
};
