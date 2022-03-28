import { Router } from 'express';
import { getNewestTweetId } from '../utils/newestId.js';
import request from 'postman-request';
import { auth } from '../middleware/auth.js';

const router = new Router();

router.get('/twitter/users', auth, async (req, res) => {

	const url = 'https://api.twitter.com/2/users/by/username/' + req.query.username+ '?expansions=pinned_tweet_id';

	const oauth = await req.user.getTwitterApiAccessTokens();
	

	request.get({ url, oauth }, (e, r, user) => {
		res.send(user);
	});	
});	

router.post('/twitter/tweets', auth, async (req, res) => {
	const url = 'https://api.twitter.com/2/tweets';

	const body = {
		text: req.body.text
	};

	const oauth = await req.user.getTwitterApiAccessTokens();

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

export { router };