import { dev } from '$app/environment';
import emailVerificationBody from './emails/email-verification-body';
import { mailjet, noReplyEmail } from './mailjet';

export interface EmailTo {
	email: string;
	name: string;
}

export const sendEmail = async (content: string, to: EmailTo) => {
	const result = await mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: noReplyEmail,
					Name: 'Twiddly'
				},
				To: [
					{
						Email: dev ? 'contact@lucienn.dev' : to.email,
						Name: to.name
					}
				],
				Subject: 'Your verification code',
				HTMLPart: content
			}
		]
	});

	return result;
};

export const sendOTPVerificationEmail = async (code: string, to: EmailTo): Promise<boolean> => {
	const { response } = await sendEmail(emailVerificationBody(code, to), to);

	return response.status === 200;
};
