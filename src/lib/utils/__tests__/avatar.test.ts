import { AvatarBackgroundColor } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { getAvatarBgColor, getProfileAvatar } from '../avatar';

describe('getAvatarBgColor', () => {
	it.each([
		[AvatarBackgroundColor.LIGTH_BLUE, '86c9e1'],
		[AvatarBackgroundColor.THISTLE, '9d87c2'],
		[AvatarBackgroundColor.LAVENDER, 'a6a7e8'],
		[AvatarBackgroundColor.MISTYROSE, 'f5a3aa'],
		[AvatarBackgroundColor.PEACH, 'f5c08f'],
		[AvatarBackgroundColor.LIME, 'b3d89f']
	])('should return the correct color code for %s', (bgColor, expectedColor) => {
		expect(getAvatarBgColor(bgColor)).toBe(expectedColor);
	});

	it('should return the default color when null is passed', () => {
		expect(getAvatarBgColor(null)).toBe('a6a7e8');
	});
});

describe('getProfileAvatar', () => {
	it('should generate the correct avatar URL for a profile', () => {
		const mHandle = 'john_doe';
		const mAvatarBackgroundColor = AvatarBackgroundColor.PEACH;

		const result = getProfileAvatar({
			handle: mHandle,
			avatarBackgroundColor: mAvatarBackgroundColor
		});

		expect(result).toBe(
			`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=john_doe&backgroundColor=f5c08f`
		);
	});

	it('should handle null backgroundColor and still generate correct URL', () => {
		const mProfile = {
			handle: 'john_doe',
			avatarBackgroundColor: null
		};

		const result = getProfileAvatar(mProfile);

		expect(result).toBe(
			'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=john_doe&backgroundColor=a6a7e8'
		);
	});
});
