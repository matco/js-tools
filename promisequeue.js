export class PromiseQueue {
	constructor(result_callback) {
		this.promises = [];
		this.resultCallback = result_callback;
		this.endCallback;
		this.exceptionCallback;
		this.running;
	}
	run() {
		if(!this.running) {
			if(this.promises.isEmpty()) {
				if(this.endCallback) {
					this.endCallback();
				}
			}
			else {
				this.running = this.promises.shift();
				this.running.call()
					.then(result => {
						if(this.resultCallback) {
							this.resultCallback(result);
						}
						this.running = undefined;
						this.run();
					})
					.catch(exception => {
						if(this.exceptionCallback) {
							this.exceptionCallback(exception);
						}
					});
			}
		}
	}
	add(promise) {
		this.promises.push(promise);
		this.run();
		return this;
	}
	addAll(promises) {
		this.promises.pushAll(promises);
		this.run();
		return this;
	}
	clear() {
		this.promises = [];
		return this;
	}
	then(callback) {
		this.endCallback = callback;
		return this;
	}
	catch(callback) {
		this.exceptionCallback = callback;
		return this;
	}
}
