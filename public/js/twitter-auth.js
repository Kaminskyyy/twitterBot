const button = document.getElementById('cookie');

button.addEventListener('click', (event) => {
	event.preventDefault();

	alert(document.cookie);
});