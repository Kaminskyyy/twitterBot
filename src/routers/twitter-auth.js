import { Router } from 'express';
import request from 'postman-request';
import { auth } from '../middleware/auth.js';
const router = new Router();

let callback = 'http://localhost:2000/callback' ;
if (process.env.PORT) {
	callback = 'https://twitter-bot-2000.herokuapp.com/callback';
}

const consumerKeys = {
	callback,
	consumer_key: '25dca2P7hKDXGAvlQrAVAvzpP',
	consumer_secret: 'PS07aydBT3f3xZvap6fibyLjcGBAf0b2IbtBjCepUHEBxKdf9h',
};

const waitingUsers = new Map();

router.get('/auth', auth, async (req, res) => {
	
	const url = 'https://api.twitter.com/oauth/request_token';

	request.post({ url, oauth: consumerKeys }, (e, r, body) => {

		let tokens = body.split('&').reduce((result, item) => {
			let pair = item.split('=');
			result[pair[0]] = pair[1];
			return result;
		}, {});
		
		delete tokens.oauth_callback_confirmed;

		const userData = {
			user: req.user,
			tokens: {
				token: tokens.oauth_token,
				token_secret: tokens.oauth_token_secret,
			},
		};

		waitingUsers.set(tokens.oauth_token, userData);

		const url = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + tokens.oauth_token;

		res.send({ url });
	});
});

router.get('/callback', (req, res) => {
	const userData = waitingUsers.get(req.query.oauth_token);

	if (!userData) {
		const message = encodeURIComponent('Unable to find user!');
		res.redirect('/error?=' +  message);
	}

	userData.tokens.verifier = req.query.oauth_verifier; 

	const url = 'https://api.twitter.com/oauth/access_token';

	request.post({ url, oauth: userData.tokens }, (e, r, body) => {
		
		const userAccessTokens = body.split('&').reduce((result, item) => {
			let pair = item.split('=');
			result[pair[0]] = pair[1];
			return result;
		}, {});
		
		// TODO 
		// В userAccessTokens токены доступа ПОЛЬЗОВАТЕЛЯ
		// их сохранить в бдшку
		// ЗАШИФРОВАННЫМИ

		userData.user.oauth_token = userAccessTokens.oauth_token;
		userData.user.oauth_token_secret = userAccessTokens.oauth_token_secret;
		userData.user.save();

		// console.log(user);
		// console.log('callback DGSGSDGSGSRG');
		// console.log(userAccessTokens);
		res.redirect('/menu');
	});
});

export { router };