const tweetForm = document.getElementById('tweetForm');
const replyForm = document.getElementById('replyForm');
const mailingForm = document.getElementById('mailingForm');

const bearer = getBearer();

tweetForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const form = new FormData(tweetForm);

	const body = {
		text: form.get('tweet'),
	};
	
	try {
		const response = await fetch('/twitter/tweets', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': 'Bearer ' + bearer,
			},
			body: JSON.stringify(body) 
		});

		const result = await response.json();
		console.log(result);
	} catch (error) {
		console.log(error);
	}
});

replyForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const form = new FormData(replyForm);

	const body = {
		text: form.get('tweet'),
		replyToUser: form.get('replyToUser'),
	};

	try {
		const response = await fetch('/twitter/tweets', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + bearer,		
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(body),
		});

		const result = await response.json();
		console.log(result);
	} catch (error) {
		console.log(error);
	}
});

mailingForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const form = new FormData(mailingForm);

	try {
		const response = await fetch('/twitter/mailing', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + bearer,
			},
			body: form,
		});

		const result = await response.json();
		console.log(result);
	} catch (error) {
		console.log(error);
	}
});

function getBearer() {
	return document.cookie.split(';').reduce((res, str) => {
		const pair = str.split('=');
		if (pair[0] === 'bearer') return pair[1];
		return false; 
	}, null);
}