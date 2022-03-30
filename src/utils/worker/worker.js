import { workerData, parentPort } from 'worker_threads';
import request from 'postman-request';
import { getNewestTweetId } from '../newestId.js';
import { extractUsernames } from '../excel.js';

parentPort.postMessage('Worker created!');

const { usernamesFileBuffer, tweet, oauth } = workerData;
const url = 'https://api.twitter.com/2/tweets';

const usernames = extractUsernames(usernamesFileBuffer);

parentPort.postMessage('Usernames extracted!');

for (let username of usernames) {
	postTweet(username);
}

parentPort.postMessage('Tweets posted!');

async function postTweet(username) {
	try {
		const in_reply_to_tweet_id = await getNewestTweetId(username, oauth);

		const body = {
			text: tweet,
			reply: {
				in_reply_to_tweet_id,
			}
		};

		body.reply = {
			in_reply_to_tweet_id,
		};

		request.post({ url, oauth, body, json: true }, (e, r, body) => {
			if (e) throw new Error();
			console.log(r.body);
		});
	} catch(error) {
		console.log(error);
	}
}