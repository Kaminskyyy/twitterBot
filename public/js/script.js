const userForm = document.getElementById('userForm');
const userInput = document.getElementById('userInput');

const tweetForm = document.getElementById('tweetForm');
const tweetInput = document.getElementById('tweetInput');

userForm.addEventListener('submit', (event) => {
	event.preventDefault();

	fetch('/user?screen_name=' + userInput.value)
		.then((response) => response.json())
		.then((user) => console.log(user));
});

tweetForm.addEventListener('submit', (event) => {
	event.preventDefault();

	fetch('/postTweet?text=' + tweetInput.value)
		.then((response) => response.json())
		.then((user) => console.log(user));
});