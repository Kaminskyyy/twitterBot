import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import hbs from 'hbs';
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import { router as userRouter } from './routers/user.js';
import { router as twitterRouter } from './routers/twitter.js';
import { router as twitterAuthRouter } from './routers/twitter_auth.js';
import { router as pagesRouter } from './routers/pages.js';
import './db/mongoose.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT;



const app = express();

//	Template engine settings
app.set('view engine', 'hbs');
app.set('views', join(__dirname, '../templates/views'));
hbs.registerPartials(join(__dirname, '../templates/partials'));

//	Middlewar
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(express.json());
app.use(express.static(join(__dirname,  '../public')));

//	Routers
app.use(pagesRouter);
app.use(twitterRouter);
app.use(userRouter);
app.use(twitterAuthRouter);

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});