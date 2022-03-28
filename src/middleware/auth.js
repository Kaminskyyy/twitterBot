import jwt from 'jsonwebtoken';
import User from '../models/user.js';

async function auth(req, res, next) {
	try {
		const token = req.get('Authorization').replace('Bearer ', '');
		const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

		if (!user) {
			throw new Error();
		}

		req.user = user;
		req.token = token;

		next();
	} catch (error) {
		res.status(401).send('Please authenticate!');
	}
}

export { auth };