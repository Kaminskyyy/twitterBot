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

app.get('/auth', (req, res) => {
	request.post({ url, oauth }, (e, r, body) => {
		const req_data = qs.parse(body);
		//res.send(req_data);
		const uri = 'https://api.twitter.com/oauth/authenticate' + '?' + qs.stringify({oauth_token: req_data.oauth_token});

		token_secret = req_data.oauth_token_secret;
		res.redirect(uri);
	});
});

app.get('/callback', (req, res) => {
	//res.send(req.query);
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
	console.log(req.query);

	const url = 'https://api.twitter.com/2/users/by/username/' + req.query.screen_name;
		
	request.get({ url, oauth }, (e, r, user) => {
		res.send(user);
	});
});	

app.get('/postTweet', (req, res) => {
	let url = 'https://api.twitter.com/2/tweets';
	//url += '?' + req.query.text;

	const body = {
		text: req.query.text
	};

	request.post({ url, oauth, body, json: true}, (e, r, body) => {
		console.log(body);
	});
});

app.listen(2000, () => {
	console.log('Listening...');
});