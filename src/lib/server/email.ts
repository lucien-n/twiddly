import { dev } from '$app/environment';
import { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC } from '$env/static/private';
import Mailjet from 'node-mailjet';
import emailVerificationBody from './email/email-verification-body';

export const mailjet = new Mailjet({
	apiKey: MJ_APIKEY_PUBLIC,
	apiSecret: MJ_APIKEY_PRIVATE
});

const noReplyEmail = 'no-reply@twiddly.dev';

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
