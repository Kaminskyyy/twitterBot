const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

loginBtn.addEventListener('click', (event) => {
	event.preventDefault();

	const user = {
		email: emailField.value,
		password: passwordField.value,
	};

	fetch('/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	}).then((res) => {

		if (!res.ok) { 
			alert('Нахуй ты пароль забыл?');
			passwordField.value = '';
			throw new Error('Unable to login');
		} 
		
		return res.json();
	}).then((body) => {
		window.location = '/menu';
	}).catch(console.log);
});



registerBtn.addEventListener('click', (event) => {
	event.preventDefault();
	
	const user = {
		email: emailField.value,
		password: passwordField.value,
	};

	fetch('/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	}).then((res) => {
		if (!res.ok) throw new Error('Unable to register user!');
		
		return res.json();
	}).then((body) => {

		return fetch('/auth', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + body.token,
			},
		});

	}).then((res) => {
		if (!res.ok) throw new Error('Unable to authorize!');

		return res.json();
	}).then((body) => window.location = body.url)
		.catch(console.log);
});

function getBearer() {
	return document.cookie.split(';').reduce((res, str) => {
		const pair = str.split('=');
		if (pair[0] === 'bearer') return pair[1];
		return false; 
	}, null);
}