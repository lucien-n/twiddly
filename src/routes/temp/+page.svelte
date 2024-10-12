<script lang="ts">
	import EmailVerificationCode from '$lib/server/email/email-verification-otp.svelte';
	import { alphabet, generateRandomString } from 'oslo/crypto';
</script>

<EmailVerificationCode otp={generateRandomString(6, alphabet('0-9', 'A-Z'))} expiryMinutes={15} />
