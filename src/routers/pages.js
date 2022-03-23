import { Router } from 'express';

const router = new Router();

router.get('/', (req, res) => {
	res.render('auth');
});

router.get('/menu', (req, res) => {
	res.render('menu');
});

router.get('/account', (req, res) => {
	res.render('profile');
});

router.get('/error', (req, res) => {
	res.render('error', {
		message: req.query.message,
	});
});

export { router };
