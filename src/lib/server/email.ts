import { dev } from '$app/environment';
import { NO_REPLY_EMAIL } from '../constants';
import emailVerificationBody from './emails/email-verification-body';
import { mailjet } from './mailjet';

export interface EmailTo {
	email: string;
	name: string;
}

export const sendEmail = async (content: string, subject: string, to: EmailTo) => {
	const result = await mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: NO_REPLY_EMAIL,
					Name: 'Twiddly'
				},
				To: [
					{
						Email: dev ? 'contact@lucienn.dev' : to.email,
						Name: to.name
					}
				],
				Subject: subject,
				HTMLPart: content
			}
		]
	});

	return result;
};

export const sendOTPVerificationEmail = async (code: string, to: EmailTo): Promise<boolean> => {
	const { response } = await sendEmail(
		emailVerificationBody(code, to),
		'Your verification code',
		to
	);

	return response.status === 200;
};
