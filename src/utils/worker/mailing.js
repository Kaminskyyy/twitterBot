import { Worker } from 'worker_threads';

async function startMailing(usernamesFileBuffer, oauth, tweet) {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./src/utils/worker/worker.js', {
			workerData: {
				usernamesFileBuffer,
				oauth,
				tweet,
			}
		});

		worker.on('message', (msg) => {
			if (msg === 'completed') {
				resolve();
			}

			console.log(msg);
		});

		worker.on('error', (error) => {
			console.log(error);
			reject(error);
		});

		worker.on('exit', () => {
			console.log('Finish!');
		});
	});
}

export { startMailing };