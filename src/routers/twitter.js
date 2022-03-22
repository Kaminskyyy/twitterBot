import { Router } from 'express';
import { getNewestTweetId } from '../utils/reply.js';
import request from 'postman-request';
import { auth } from '../middleware/auth.js';

const router = new Router();

const consumerKeys = {
	consumer_key: '25dca2P7hKDXGAvlQrAVAvzpP',
	consumer_secret: 'PS07aydBT3f3xZvap6fibyLjcGBAf0b2IbtBjCepUHEBxKdf9h',
};

router.get('/user', auth, (req, res) => {

	const url = 'https://api.twitter.com/2/users/by/username/' + req.query.screen_name + '?expansions=pinned_tweet_id';

	request.get({ url, oauth: new Oauth(req.user) }, (e, r, user) => {
		console.log(user);
		res.send(user);
	});	
});	

router.post('/postTweet', auth,  (req, res) => {
	const url = 'https://api.twitter.com/2/tweets';

	const body = {
		text: req.body.text
	};

	if (req.body.replyToId) {
		body.reply = {
			in_reply_to_tweet_id: req.body.replyToId,
		};
	}


	request.post({ url, oauth: new Oauth(req.user), body, json: true}, (e, r, body) => {
		res.send(body);
	});
});

router.post('/postReply', (req, res) => {
	getNewestTweetId(req.body.replyToUsername, oauth, (err, newestId) => {

		if (!err) {
			const url = 'https://twitter-bot-2000.herokuapp.com/postTweet';

			const body = {
				text: req.body.text,
				replyToId: newestId
			};

			request.post({ url, body, json: true }, (e, r, body) => {

			});
		}
	});
});

export { router };

function Oauth(user) {
	this.consumer_key = consumerKeys.consumer_key;
	this.consumer_secret = consumerKeys.consumer_secret;
	this.token = user.oauth_token;
	this.token_secret = user.oauth_token_secret;
}