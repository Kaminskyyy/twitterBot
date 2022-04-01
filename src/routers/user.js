import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/user.js';

const router = new Router();

router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();

		const token = user.generateAuthToken();

		res.cookie('bearer', token);
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.user._id);
		res.send(req.user);
	} catch (error) {
		res.status(500).send();
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

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

router.post('/users/logoutAll', auth, (req, res) => {
	try {
		req.user.tokens = [];
		req.user.save();
		res.send();
	} catch (error) {
		res.status(400);
	}
});

export { router };