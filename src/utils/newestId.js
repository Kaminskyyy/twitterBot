import request from 'postman-request';

async function getNewestTweetId(username, oauth) {
	const url = 'https://api.twitter.com/2/tweets/search/recent?query=' + encodeURIComponent('from:' + username);  
	
	return new Promise((resolve, reject) => {
		request.get({ url, oauth, json: true }, (e, r, body) => {
			
			console.log(body);

			if (body.meta.result_count < 1) {
				reject('No tweets!');
			} else {
				resolve(body.meta.newest_id);
			}
		});
	});
}

export { getNewestTweetId };