const tweetForm = document.getElementById('tweetForm');
const tweetInput = document.getElementById('tweetInput');

const replyToForm = document.getElementById('replyToForm');
const replyToInput = document.getElementById('replyToInput');
const replyTweetForm = document.getElementById('replyTweetForm');
const replyTweetInput = document.getElementById('replyTweetInput');

const bearer = getBearer();

tweetForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const body = {
		text: tweetInput.value,
	};
	
	fetch('/twitter/tweets', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': 'Bearer ' + bearer,
		},
		body: JSON.stringify(body) 
	})
		.then((res) => { 
			if (!res.ok) throw new Error('Bad request');
			
			return res.json();
		})
		.then((body) => console.log(body))
		.catch(console.log);
});

replyTweetForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const body = {
		text: replyTweetInput.value,
		replyToUser: replyToInput.value
	};

	fetch('/twitter/tweets', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': 'Bearer ' + bearer,
		},
		body: JSON.stringify(body)
	})
		.then((res) => {
			if (!res.ok) throw new Error('Bad request');

			return res.json();
		})
		.then((body) => console.log(body))
		.catch(console.log);
});

function getBearer() {
	return document.cookie.split(';').reduce((res, str) => {
		const pair = str.split('=');
		if (pair[0] === 'bearer') return pair[1];
		return false; 
	}, null);
}