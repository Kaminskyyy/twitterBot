import { parentPort } from 'worker_threads';
import { extractUsernames } from '../excel.js';
import { postTweet } from '../twitter_utils.js';

parentPort.on('message', async (task) => {
	const { buffer, tweet, oauth } = task;

	const usernames = extractUsernames(buffer);

	const promise = Promise.allSettled(usernames.map((username) => postTweet(tweet, oauth, { inReplyToUser: username })));

	parentPort.postMessage(await promise);
});