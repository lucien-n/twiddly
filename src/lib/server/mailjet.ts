import { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC } from '$env/static/private';
import Mailjet from 'node-mailjet';

export const mailjet = new Mailjet(
	process.env.NODE_ENV === 'test'
		? { apiKey: 'test', apiSecret: 'test' }
		: {
				apiKey: MJ_APIKEY_PUBLIC,
				apiSecret: MJ_APIKEY_PRIVATE
			}
);
