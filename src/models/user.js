import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cryptoJS from 'crypto-js';

import { encryptTokens, decryptTokens } from '../utils/cipher.js';

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid!');
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	tokens: [{
		token: {
			type: String,
			required: true,
		}
	}],
	oauth_token: {
		type: String,
		default: 'null',
	},
	oauth_token_secret: {
		type: String,
		default: 'null',
	}
});

userSchema.methods.generateAuthToken = function() {
	const user = this;

	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);
	user.tokens.push({ token });
	
	user.save();

	return token;
};


userSchema.methods.getTwitterApiAccessTokens = async function() {
	const user = this;
	const keys = {};

	const { oauthTokenDecrypted, oauthTokenSecretDecrypted } = await decryptTokens(user);

	keys.consumer_key = process.env.CONSUMER_KEY;
	keys.consumer_secret = process.env.CONSUMER_SECRET;
	keys.token = oauthTokenDecrypted;
	keys.token_secret = oauthTokenSecretDecrypted;

	return keys;
};

userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Unable to login!');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('Unable to login!');
	}

	return user;
};

userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	if (user.isModified('oauth_token')) {
		const { oauthTokenEncrypted, oauthTokenSecretEncrypted } = await encryptTokens(user);

		user.oauth_token = oauthTokenEncrypted;
		user.oauth_token_secret = oauthTokenSecretEncrypted;
	}
	
	next();
});

const User = mongoose.model('User', userSchema);

export default User;