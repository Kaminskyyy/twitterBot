import { parentPort } from 'worker_threads';
import {  encryptTokens, decryptTokens } from '../cipher.js'; 

parentPort.on('message', (task) => {
	if (task.task === 'encrypt') {
		parentPort.postMessage(encryptTokens(task.tokens));
	}
	if (task.task === 'decrypt') {
		parentPort.postMessage(decryptTokens(task.tokens));
	}
});