import { AsyncResource } from 'async_hooks';
import { EventEmitter } from 'events';
import path from 'path';
import { Worker } from 'worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');
const kSelf = Symbol('kSelfWorkerPool');

class WorkerPoolTaskInfo extends AsyncResource {
	constructor(callback) {
		super('WorkerPoolTaskInfo');
		this.callback = callback;
	}

	done(err, result) {
		this.runInAsyncScope(this.callback, null, err, result);
		this.emitDestroy();  // `TaskInfo`s are used only once.
	}
}

class WorkerPool extends EventEmitter {
	constructor(numThreads, workerPath) {
		super();
		this.workerPath = workerPath;
		this.workers = [];
		this.freeWorkers = [];
		this.tasks = [];

		for (let i = 0; i < numThreads; i++) {
			this.addNewWorker();
		}

		this.on(kWorkerFreedEvent, () => {
			if (this.tasks.length > 0) {
				const { task, callback } = this.tasks.shift();
				this.runTask(task, callback);
			}
		});
	}

	addNewWorker() {
		const worker = new Worker(this.workerPath, import.meta.url);

		worker.on('message', (msg) => {
			worker[kTaskInfo].done(null, msg);
			worker[kTaskInfo] = null;

			this.freeWorkers.push(worker);
			this.emit(kWorkerFreedEvent);
		});

		worker.on('error', (error) => {
			if (worker[kTaskInfo]) {
				worker[kTaskInfo].done(error, null);
			} else {
				worker.emit('error', error);
			}

			this.workers.splice(this.workers.indexOf(worker), 1);
			this.addNewWorker();
		});

		this.workers.push(worker);
		this.freeWorkers.push(worker);
		this.emit(kWorkerFreedEvent);
	}

	runTask(task, callback) {
		if (this.freeWorkers.length === 0) {
			this.tasks.push({ task, callback });
			return;
		}

		const worker = this.freeWorkers.pop();
		worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
		worker.postMessage(task);
	}

	runTaskPromise(task) {
		return new Promise((resolve, reject) => {
			this.runTask(task, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});
	}

	close() {
		for (const worker of this.workers) worker.terminate();
	}
}

export default WorkerPool;