import { Router } from 'express';
import request from 'postman-request';
import { auth } from '../middleware/auth.js';
const router = new Router();

const consumerKeys = {
	callback: process.env.TWITTER_AUTH_CALLBACK,
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
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

		userData.user.oauth_token = userAccessTokens.oauth_token;
		userData.user.oauth_token_secret = userAccessTokens.oauth_token_secret;
		userData.user.save();
		
		waitingUsers.delete(req.query.oauth_token);

		res.redirect('/menu');
	});
});

export { router };