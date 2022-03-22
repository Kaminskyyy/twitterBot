import { dirname, join } from 'path';
import { fileURLToPath, URLSearchParams } from 'url';

import hbs from 'hbs';
import express from 'express';
import cookieParser from 'cookie-parser';

import { router as userRouter } from './routers/user.js';
import { router as twitterRouter } from './routers/twitter.js';
import { router as twitterAuthRouter } from './routers/twitter-auth.js';
import './db/mongoose.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const port = process.env.PORT || 2000;

const app = express();

app.set('view engine', 'hbs');
app.set('views', join(__dirname, '../templates/views'));
hbs.registerPartials(join(__dirname, '../templates/partials'));

app.use(cookieParser('THERE_MUST_BE_A_SECRET_KEY'));
app.use(express.json());
app.use(twitterRouter);
app.use(userRouter);
app.use(twitterAuthRouter);
app.use(express.static(join(__dirname,  '../public')));

console.log(join(__dirname,  '/public'));

app.get('/', (req, res) => {
	res.render('auth');
});

app.get('/menu', (req, res) => {
	res.render('menu');
});

app.get('/error', (req, res) => {
	res.render('error', {
		message: req.query.message,
	});
});

app.listen(port, () => {
	console.log('port: ' + port + '\nListening...');
});

