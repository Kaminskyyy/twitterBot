import { Router } from 'express';
import { getNewestTweetId } from '../utils/newestId.js';
import request from 'postman-request';
import { auth } from '../middleware/auth.js';

const router = new Router();

router.get('/twitter/users', auth, (req, res) => {

	const url = 'https://api.twitter.com/2/users/by/username/' + req.query.username+ '?expansions=pinned_tweet_id';

	const oauth = req.user.getTwitterApiAccessTokens();
	oauth.username = req.query.username;

	request.get({ url, oauth }, (e, r, user) => {
		res.send(user);
	});	
});	

router.post('/twitter/tweets', auth, async (req, res) => {
	const url = 'https://api.twitter.com/2/tweets';

	const body = {
		text: req.body.text
	};

	const oauth = req.user.getTwitterApiAccessTokens();

	try {
		if (req.body.replyToUser) {
			const in_reply_to_tweet_id = await getNewestTweetId(req.body.replyToUser, oauth);

			body.reply = {
				in_reply_to_tweet_id,
			};
		}

		request.post({ url, oauth, body, json: true}, (e, r, body) => {
			if (e) throw new Error();

			res.send(body);
		});
	} catch (error) {
		res.status(400).send();
	}
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