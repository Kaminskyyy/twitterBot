import request from 'postman-request';

// Searches for newest tweet and returns its ID
async function getNewestTweetId(username, oauth) {
	const url = 'https://api.twitter.com/2/tweets/search/recent?query=' + encodeURIComponent('from:' + username);  
	
	return new Promise((resolve, reject) => {
		request.get({ url, oauth, json: true }, (e, r, body) => {

			if (body.meta.result_count < 1) {
				reject('No tweets!');
			} else {
				resolve(body.meta.newest_id);
			}
		});
	});
}


// Post tweets
//
const url = 'https://api.twitter.com/2/tweets';

async function postTweet(tweet, oauth, options = {}) {
	return new Promise(async (resolve, reject) => {
		
		const { inReplyToUser } = options;

		const body = {
			text: tweet,
		};

		if (inReplyToUser) {
			try {
				body.reply = {
					in_reply_to_tweet_id: await getNewestTweetId(inReplyToUser, oauth),
				};
			} catch (error) {
				reject({ error });
			}
		}

		request.post({ url, oauth, body, json: true }, (error, r, body) => {
			if (error) { 
				reject({ error, inReplyToUser });
			} else if (!body.data) {
				reject({ error: body.detail, inReplyToUser });
			} else {
				resolve({ data: body.data, inReplyToUser });
			}
		});
	});
}

export { getNewestTweetId, postTweet };