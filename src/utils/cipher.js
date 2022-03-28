import cryptoJS from 'crypto-js';

async function encryptTokens({ oauth_token, oauth_token_secret } = {}) {
	return new Promise((resolve, reject) => {
		const oauthTokenEncrypted = cryptoJS.AES.encrypt(oauth_token, process.env.AES_SECRET).toString();
		const oauthTokenSecretEncrypted = cryptoJS.AES.encrypt(oauth_token_secret, process.env.AES_SECRET).toString();

		resolve({ 
			oauthTokenEncrypted, 
			oauthTokenSecretEncrypted, 
		});
	});
}

async function decryptTokens({ oauth_token, oauth_token_secret } = {}) {
	return new Promise((resolve, reject) => {
		const oauthTokenDecrypted = cryptoJS.AES.decrypt(oauth_token, process.env.AES_SECRET).toString(cryptoJS.enc.Utf8);
		const oauthTokenSecretDecrypted = cryptoJS.AES.decrypt(oauth_token_secret, process.env.AES_SECRET).toString(cryptoJS.enc.Utf8);

		resolve({
			oauthTokenDecrypted,
			oauthTokenSecretDecrypted,
		});
	});
}

export { encryptTokens, decryptTokens };