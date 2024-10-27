export const getProfileSelect = () => ({
	id: true,
	role: true,
	handle: true,
	displayName: true,
	avatarBackgroundColor: true,
	privacySettings: { select: { private: true } }
});
