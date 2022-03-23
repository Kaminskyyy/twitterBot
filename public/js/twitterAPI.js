const userForm = document.getElementById('userForm');
const userInput = document.getElementById('userInput');

const tweetForm = document.getElementById('tweetForm');
const tweetInput = document.getElementById('tweetInput');

const replyToForm = document.getElementById('replyToForm');
const replyToInput = document.getElementById('replyToInput');
const replyTweetForm = document.getElementById('replyTweetForm');
const replyTweetInput = document.getElementById('replyTweetInput');

const bearer = getBearer();

userForm.addEventListener('submit', (event) => {
	event.preventDefault();

	// REPLACE
	// const bearer = document.cookie.split(';').reduce((res, str) => {
	// 	const pair = str.split('=');
	// 	if (pair[0] === 'bearer') return pair[1];
	// 	return false; 
	// }, null);
	// REPLACE
	const query = '?username=' + userInput.value;

	fetch('/twitter/users' + query, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': 'Bearer ' + bearer,
		},
	})
		.then((response) => response.json())
		.then((user) => console.log(user));
});

tweetForm.addEventListener('submit', (event) => {
	event.preventDefault();

	// REPLACE
	// const bearer = document.cookie.split(';').reduce((res, str) => {
	// 	const pair = str.split('=');
	// 	if (pair[0] === 'bearer') return pair[1];
	// 	return false; 
	// }, null);
	// REPLACE

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
		.then((response) => response.text())
		.then((tweet) => console.log(tweet));
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
		.then((response) => response.json())
		.then((body) => console.log(body));
});

function getBearer() {
	return document.cookie.split(';').reduce((res, str) => {
		const pair = str.split('=');
		if (pair[0] === 'bearer') return pair[1];
		return false; 
	}, null);
}