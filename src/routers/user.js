import { Router } from 'express';
import User from '../models/user.js';

const router = new Router();

router.post('/users', async (req, res) => {
	const user = new User(req.body);

	console.log(user);
	try {
		await user.save();

		console.log('HERE');
		const token = user.generateAuthToken();

		res.cookie('bearer', token);
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = user.generateAuthToken();

		res.cookie('bearer', token);
		res.send({ user, token });
	} catch (error) {
		res.status(400).send();
	}
});

export { router } ;