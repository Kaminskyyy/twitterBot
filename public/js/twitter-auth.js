const button = document.getElementById('auth');

const _id = 1234567890;

const user = { _id };

button.addEventListener('click', (event) => {
	event.preventDefault();

	const bearer = document.cookie.split(';').reduce((res, str) => {
		const pair = str.split('=');
		if (pair[0] === 'bearer') return pair[1];
		return false; 
	}, null);

	fetch('/auth' + _id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + bearer,
		},
	})
		.then((response) => response.json())
		.then((body) => window.location = body.url)
		.catch(console.log);	
});