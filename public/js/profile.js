const logoutButton = document.getElementById('logout');
const logoutAllButton = document.getElementById('logout-all');
const deleteUserButton = document.getElementById('delete-user');

const bearer = getBearer();

logoutButton.addEventListener('click', async (event) => {
	event.preventDefault();

	try {
		const response = await fetch('/users/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': 'Bearer ' + bearer,
			},
		});

		if (!response.ok) throw new Error('Unable to logout');
		document.cookie = 'bearer=';
		window.location = '/';
	} catch (error) {
		console.log(error);
	}
});

logoutAllButton.addEventListener('click', async (event) => {
	event.preventDefault();

	try {	
		const response = await fetch('/users/logoutAll', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': 'Bearer ' + bearer,
			},
		});

		if (!response.ok) throw new Error('Unable to logout');
		document.cookie = 'bearer=';
		window.location = '/';
	} catch (error) {
		console.log(error);		
	}
});

deleteUserButton.addEventListener('click', async (event) => {
	event.preventDefault();

	try {
		const response = await fetch('/users/me', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': 'Bearer ' + bearer,
			},
		});

		if (!response.ok) throw new Error('Unable to delete user');
		document.cookie = 'bearer=';
		window.location = '/';
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