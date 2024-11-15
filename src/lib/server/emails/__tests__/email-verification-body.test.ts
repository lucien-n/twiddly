import { describe, expect, it, vi } from 'vitest';
import emailVerificationBody from '../email-verification-body';
import { emailVerificationCodeExpiryMinutes } from '../../auth';

vi.mock('$env/static/public', () => ({
	PUBLIC_ORIGIN: 'http://localhost'
}));

describe('email-verification-body', () => {
	it('should return email verification body', () => {
		const mPublicOrigin = 'http://localhost';
		const mCode = '123-AZE';
		const mName = 'John Doe';
		const mEmail = 'john.doe@mail.com';

		const body = emailVerificationBody(mCode, { name: mName, email: mEmail });

		expect(body).toEqual(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your Twiddly OTP Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
            background-color: #ffffff;
            color: #000000;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
        }

        .email-header h1 {
            font-size: 24px;
            margin: 0;
        }

        .email-body {
            padding: 30px;
            text-align: center;
        }

        .otp-box {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            font-size: 28px;
            letter-spacing: 10px;
            padding: 20px;
            display: inline-block;
            font-weight: bold;
        }

        .email-footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 12px;
            border-top: 1px solid #eaeaea;
            margin-top: 30px;
        }

        .email-footer a {
            color: #000;
            text-decoration: none;
        }

        .email-footer p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <h1>Twiddly</h1>
        </div>

        <div class="email-body">
            <h2>Your OTP Code</h2>
            <p>Hello ${mName}! Here's your code to verify your email on Twiddly:</p>

            <div class="otp-box">${mCode}</div>

            <p>This code is valid for the next ${emailVerificationCodeExpiryMinutes} minutes. Please use it to complete your sign-up process.</p>

            <p>Verify your code <a href="${mPublicOrigin}/verify">here</a></p>

            <p>If you did not request this code, please ignore this email.</p>
        </div>

        <div class="email-footer">
            <p>Sent with ❤️ from Twiddly</p>
            <p><a href="${mPublicOrigin}">Visit our website</a> | <a href="${mPublicOrigin}/privacy">Privacy Policy</a></p>
        </div>
    </div>
</body>
</html>
`);
	});
});
