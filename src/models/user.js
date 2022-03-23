import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

	const token = jwt.sign({ _id: user._id.toString() }, 'secretMustBeReplaced');
	user.tokens.push({ token });
	
	user.save();

	return token;
};


userSchema.methods.getTwitterApiAccessTokens = function() {
	const user = this;
	const keys = {};

	const consumerKeys = {
		consumer_key: '25dca2P7hKDXGAvlQrAVAvzpP',
		consumer_secret: 'PS07aydBT3f3xZvap6fibyLjcGBAf0b2IbtBjCepUHEBxKdf9h',
	};

	keys.consumer_key = consumerKeys.consumer_key;
	keys.consumer_secret = consumerKeys.consumer_secret;
	keys.token = user.oauth_token;
	keys.token_secret = user.oauth_token_secret;

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
	
	next();
});

const User = mongoose.model('User', userSchema);

export default User;