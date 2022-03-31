import cryptoJS from 'crypto-js';

function encryptTokens({ oauth_token, oauth_token_secret } = {}) {
	const oauthTokenEncrypted = cryptoJS.AES.encrypt(oauth_token, process.env.AES_SECRET).toString();
	const oauthTokenSecretEncrypted = cryptoJS.AES.encrypt(oauth_token_secret, process.env.AES_SECRET).toString();

	return {		
		oauthTokenEncrypted, 
		oauthTokenSecretEncrypted, 
	};
}

function decryptTokens({ oauth_token, oauth_token_secret } = {}) {
	const oauthTokenDecrypted = cryptoJS.AES.decrypt(oauth_token, process.env.AES_SECRET).toString(cryptoJS.enc.Utf8);
	const oauthTokenSecretDecrypted = cryptoJS.AES.decrypt(oauth_token_secret, process.env.AES_SECRET).toString(cryptoJS.enc.Utf8);

	return {
		oauthTokenDecrypted,
		oauthTokenSecretDecrypted,
	};
}

export { encryptTokens, decryptTokens };