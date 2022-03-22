import request from 'postman-request';

function getNewestTweetId(screen_name, oauth, callback) {
	const url = 'https://api.twitter.com/2/tweets/search/recent?query=' + encodeURIComponent('from:' + screen_name);  
	
	request.get({ url, oauth, json:true }, (e, r, body) => {
	
		if (body.meta.result_count < 1) {
			callback('No tweets');
		} else {
			callback(undefined, body.meta.newest_id);
		}
	});
}

export { getNewestTweetId };