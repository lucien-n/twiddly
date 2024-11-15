import { mMailjet, mMailjetPostRequest } from '$tests/mocks/mailjet';
import { NO_REPLY_EMAIL } from '@/lib/constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendEmail, sendOTPVerificationEmail } from '../email';

const mDev = vi.fn();
vi.mock('$app/environment', () => ({
	get dev() {
		return mDev();
	}
}));

describe('sendEmail', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		mMailjet.post.mockReturnValue({ request: mMailjetPostRequest });
	});

	it('should send email', async () => {
		mDev.mockReturnValue(false);
		const mName = 'John Doe';
		const mEmail = 'john.doe@mail.com';
		const mBody = 'body';
		const mSubject = 'subject';

		await sendEmail(mBody, mSubject, { name: mName, email: mEmail });

		expect(mMailjet.post).toHaveBeenCalledTimes(1);
		expect(mMailjet.post).toHaveBeenCalledWith('send', {
			version: 'v3.1'
		});
		expect(mMailjet.post).toHaveReturnedWith({ request: expect.any(Function) });
		expect(mMailjetPostRequest).toHaveBeenCalledTimes(1);
		expect(mMailjetPostRequest).toHaveBeenCalledWith({
			Messages: [
				{
					From: {
						Email: NO_REPLY_EMAIL,
						Name: 'Twiddly'
					},
					HTMLPart: mBody,
					Subject: mSubject,
					To: [
						{
							Email: mEmail,
							Name: mName
						}
					]
				}
			]
		});
	});

	it('should send email to contact@lucienn.dev in dev mode', async () => {
		mDev.mockReturnValue(true);
		const mName = 'John Doe';
		const mEmail = 'john.doe@mail.com';
		const mBody = 'body';
		const mSubject = 'subject';

		await sendEmail(mBody, mSubject, { name: mName, email: mEmail });

		expect(mMailjetPostRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				Messages: expect.arrayContaining([
					expect.objectContaining({
						To: expect.arrayContaining([
							expect.objectContaining({
								Email: 'contact@lucienn.dev'
							})
						])
					})
				])
			})
		);
	});
});

describe('sendOTPVerificationEmail', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		mMailjet.post.mockReturnValue({ request: mMailjetPostRequest });
	});

	it('should send otp verification email', async () => {
		mMailjetPostRequest.mockResolvedValueOnce({ response: { status: 200 } });

		const mCode = '123-AZE';
		const mName = 'John Doe';
		const mEmail = 'john.doe@mail.com';

		await sendOTPVerificationEmail(mCode, { name: mName, email: mEmail });

		expect(mMailjet.post).toHaveBeenCalledTimes(1);
		expect(mMailjet.post).toHaveBeenCalledWith('send', {
			version: 'v3.1'
		});
		expect(mMailjetPostRequest).toHaveBeenCalledTimes(1);
		expect(mMailjetPostRequest).toHaveBeenCalledWith({
			Messages: [
				{
					From: {
						Email: NO_REPLY_EMAIL,
						Name: 'Twiddly'
					},
					HTMLPart: expect.any(String),
					Subject: 'Your verification code',
					To: [
						{
							Email: mEmail,
							Name: mName
						}
					]
				}
			]
		});
	});
});
