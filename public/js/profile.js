const logoutBtn = document.getElementById('logout');
const logoutAllBtn = document.getElementById('logoutAll');

const bearer = getBearer();

logoutBtn.addEventListener('click', (event) => {
	event.preventDefault();

	fetch('/users/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': 'Bearer ' + bearer,
		},
		body: JSON.stringify({}),
	}).then((res) => {
		if (!res.ok) {
			return Promise.reject('Unable to logout');
		}

		document.cookie = 'bearer=';
		window.location = '/';
	});
});

logoutAllBtn.addEventListener('click', (event) => {
	event.preventDefault();

	fetch('/users/logoutAll', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': 'Bearer ' + bearer,
		},
		body: JSON.stringify({}),
	}).then((res) => {
		if (!res.ok) {
			return Promise.reject('Unable to logout');
		}

		document.cookie = 'bearer=';
		window.location = '/';
	});
});

function getBearer() {
	return document.cookie.split(';').reduce((res, str) => {
		const pair = str.split('=');
		if (pair[0] === 'bearer') return pair[1];
		return false; 
	}, null);
}