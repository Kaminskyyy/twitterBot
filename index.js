import { dirname, join} from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import request from 'postman-request';
import qs from 'querystring';

import { getNewestTweetId } from './utils/reply.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const port = process.env.PORT || 2000;

const oauth = {
	callback: 'https://twitter-bot-2000.herokuapp.com/callback',
	consumer_key: '25dca2P7hKDXGAvlQrAVAvzpP',
	consumer_secret: 'PS07aydBT3f3xZvap6fibyLjcGBAf0b2IbtBjCepUHEBxKdf9h',
};

let token_secret = null;

const url = 'https://api.twitter.com/oauth/request_token';

const app = express();

app.use(express.json());
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

app.post('/postTweet', (req, res) => {
	console.log('################');
	console.log(req.body);

	let url = 'https://api.twitter.com/2/tweets';

	const body = {
		text: req.body.text
	};

	if (req.body.replyToId) {
		body.reply = {
			in_reply_to_tweet_id: req.body.replyToId,
		};
	}
	

	request.post({ url, oauth, body, json: true}, (e, r, body) => {
		console.log(body);
	});
});

app.post('/postReply', (req, res) => {
	getNewestTweetId(req.body.replyToUsername, oauth, (err, newestId) => {

		if (!err) {
			const url = 'http://localhost:2000/postTweet';

			const body = {
				text: req.body.text,
				replyToId: newestId
			};

			request.post({ url, body, json: true }, (e, r, body) => {

			});
		}
	});
});

app.listen(port, () => {
	console.log('Listening...');
});