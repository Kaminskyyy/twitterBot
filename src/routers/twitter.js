import { Router } from 'express';
import { getNewestTweetId } from '../utils/newestId.js';
import request from 'postman-request';
import { auth } from '../middleware/auth.js';
import multer from 'multer';
import { startMailing } from '../utils/worker/mailing.js';
import WorkerPool from '../utils/worker/threadpool.js';

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

		request.post({ url, oauth, body, json: true }, (e, r, body) => {
			if (e) throw new Error();

			res.send(body);
		});
	} catch (error) {
		res.status(400).send();
	}
});

const upload = multer({
	fileFilter(req, file, callback) {
		if (!file.originalname.match(/\.(xlsx|XLSX)$/)) {
			return callback(new Error('Error! Allowed extensions: xlsx'));
		}
		callback(undefined, true);
	}
});

router.post('/twitter/mailing', auth, upload.single('doc'), async (req, res) => {
	const oauth = await req.user.getTwitterApiAccessTokens();

	startMailing(req.file.buffer, oauth, req.body.tweet);

	res.send();
});

export { router };