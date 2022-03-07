import { dirname, join} from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import request from 'postman-request';
import qs from 'querystring';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




const oauth = {
	callback: 'http://localhost:2000/callback',
	consumer_key: '9EWItTB05s049qtfZWC7VImY2',
	consumer_secret: 'YB0pxAQ7eGLNBJdK9EL46R3tq96CyJ5fQStZd0duEfqBx7Jppv',
};

let token_secret = null;

const url = 'https://api.twitter.com/oauth/request_token';

const app = express();

app.use(express.static(join(__dirname,  '/public')));

console.log(join(__dirname,  '/public'));

app.get('/auth', async (req, res) => {
	request.post({ url, oauth }, (e, r, body) => {
		const req_data = qs.parse(body);
		
		const uri = 'https://api.twitter.com/oauth/authenticate' + '?' + qs.stringify({oauth_token: req_data.oauth_token});

		token_secret = req_data.oauth_token_secret;
		res.redirect(uri);
	});
});

app.get('/callback', (req, res) => {
	oauth.token = req.query.oauth_token;
	oauth.token_secret = token_secret;
	oauth.verifier = req.query.oauth_verifier;
	delete oauth.callback;

	const url = 'https://api.twitter.com/oauth/access_token';

	request.post({ url, oauth }, (e, r, body) => {
		const perm_data = qs.parse(body);

		oauth.token = perm_data.oauth_token;
		oauth.token_secret = perm_data.oauth_token_secret;
		delete oauth.verifier;
		
		res.redirect('/menu.html');
	});
});



app.get('/user', (req, res) => {

	const url = 'https://api.twitter.com/2/users/by/username/' + req.query.screen_name + '?expansions=pinned_tweet_id';
	
	request.get({ url, oauth }, (e, r, user) => {
		console.log(user);
		res.send(user);
	});
});	

app.get('/postTweet', (req, res) => {
	let url = 'https://api.twitter.com/2/tweets';

	const body = {
		text: req.query.text
	};

	if (req.query.idToReply) {
		body.reply = {
			in_reply_to_tweet_id: req.query.idToReply,
		};
	}
	

	request.post({ url, oauth, body, json: true}, (e, r, body) => {
		console.log(body);
	});
});

app.get('/postReply', (req, res) => {
	const url = 'http://localhost:2000/user?screen_name=' + req.query.screen_name;

	request.get({ url, json: true }, (e, r, body) => {
		const url = 'https://api.twitter.com/2/tweets/search/recent?query=' + encodeURIComponent('from:' + body.data.username);  
		
		request.get({ url, oauth, json:true }, (e, r, body) => {
			
			if (body.meta.result_count < 1) {
				res.send({error: 'no tweets'});
			} else {
				//const url = 'http://localhost:2000/postTweet?'
				request.get()
				res.send();
			}
		});
	});
});

app.listen(2000, () => {
	console.log('Listening...');
});