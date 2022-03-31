import { Router } from 'express';
import { postTweet } from '../utils/twitter_utils.js';
import request from 'postman-request';
import { auth } from '../middleware/auth.js';
import multer from 'multer';
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
	const oauth = await req.user.getTwitterApiAccessTokens();

	const options = {};
	if (req.body.replyToUser) {
		options.inReplyToUser = req.body.replyToUser;
	}
	
	try {
		const result = await postTweet(req.body.text, oauth, options);
		res.send(result);
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

const mailingWorkerPool = new WorkerPool(2, './src/utils/worker/mailing_worker.js');

router.post('/twitter/mailing', auth, upload.single('doc'), async (req, res) => {
	const oauth = await req.user.getTwitterApiAccessTokens();

	mailingWorkerPool.runTask({
		buffer: req.file.buffer,
		oauth,
		tweet: req.body.tweet
	}, (error, result) => {
		if (error) console.log('Error:\n', error);
		else console.log('Results:\n', result);
	});

	res.send();
});

export { router };