const userForm = document.getElementById('userForm');
const userInput = document.getElementById('userInput');

const tweetForm = document.getElementById('tweetForm');
const tweetInput = document.getElementById('tweetInput');

const replyToForm = document.getElementById('replyToForm');
const replyToInput = document.getElementById('replyToInput');
const replyTweetForm = document.getElementById('replyTweetForm');
const replyTweetInput = document.getElementById('replyTweetInput');

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
		.then((tweet) => console.log(tweet));
});

replyTweetForm.addEventListener('submit', (event) => {
	event.preventDefault();

	fetch('/postReply?screen_name=' + replyToInput.value)
		.then((response) => response.json())
		.then((body) => console.log(body));

	//console.log(replyToInput.value);
	//console.log(replyTweetInput.value);
});