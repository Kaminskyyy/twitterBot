import mongoose from 'mongoose';

const twitter_keys = new mongoose.Schema({
	owner: {
		type: String,
		required: true,
	},
	oauth_token: {
		type: String,
		required: true,
	},
	oauth_token_secret: {
		type: String,
		required: true,
	}
});

const TwitterKeys = new mongoose.model('Key', twitter_keys);