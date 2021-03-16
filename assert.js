function log(success, message, specification) {
	let text = success ? 'Success' : 'Fail';
	if(message) {
		text += ' : ';
		text += message;
		if(specification) {
			text += ' - ';
			text += specification;
		}
	}
	if(this.debug) {
		console.log(text);
	}
}

function check_has_begun() {
	if(this.beginTime === undefined) {
		throw new Error('Assert must be started before beginning testing');
	}
}

function check_exception(exception, exception_assert, message, specification) {
	if(!exception_assert) {
		this.success(message || 'Code throws an exception', specification);
	}
	//check exception matches criteria
	else {
		const check = exception_assert.call(undefined, exception);
		if(check === undefined) {
			this.fail(`${message}: Exception assert must return a boolean`, specification);
		}
		else if(check) {
			this.success(message || 'Code throws an exception matching criteria', specification);
		}
		else {
			this.fail(`${message}: Code does not throw the good exception: Actual [${exception}]`, specification);
		}
	}
}

export class Assert {
	constructor(onAssert, onSuccess, onFail, onBegin, onEnd, debug) {
		this.onAssert = onAssert;
		this.onSuccess = onSuccess;
		this.onFail = onFail;
		this.onBegin = onBegin;
		this.onEnd = onEnd;
		this.debug = debug || false;
		this.results = [];
		this.beginTime = undefined;
		this.endTime = undefined;
		this.counters = {
			successes: 0,
			fails: 0
		};
	}
	begin() {
		this.beginTime = new Date();
		//callback
		this.onBegin?.call(undefined, this);
	}
	end() {
		this.endTime = new Date();
		//callback
		this.onEnd?.call(undefined, this);
	}
	getDuration() {
		return this.endTime.getTime() - this.beginTime.getTime();
	}
	getSuccessesNumber() {
		return this.counters.successes;
	}
	getFailsNumber() {
		return this.counters.fails;
	}
	getTotal() {
		return this.results.length;
	}
	/**
	 * @param {string} message - The message associated to the test
	 * @param {string} [specification] - The specification associated to the test
	 */
	success(message, specification) {
		check_has_begun.call(this);
		this.results.push({success: true, message: message, specification: specification});
		//increment counter
		this.counters.successes++;
		//log
		log.call(this, true, message, specification);
		//callback
		this.onAssert?.call(undefined, this, true, message, specification);
		this.onSuccess?.call(undefined, this, message, specification);
	}
	/**
	 * @param {string} message - The message associated to the test
	 * @param {string} [specification] - The specification associated to the test
	 */
	fail(message, specification) {
		check_has_begun.call(this);
		this.results.push({success: false, message: message, specification: specification});
		//increment counter
		this.counters.fails++;
		//log
		log.call(this, false, message, specification);
		//callback
		this.onAssert?.call(undefined, this, false, message, specification);
		this.onFail?.call(undefined, this, message, specification);
	}
	equal(actual, expected, message, specification) {
		actual === expected ? this.success(message, specification) : this.fail(`${message}: Actual [${actual}] - Expected [${expected}]`, specification);
	}
	notEqual(actual, notExpected, message, specification) {
		actual !== notExpected ? this.success(message, specification) : this.fail(`${message}: Actual [${actual}] - Not expected [${notExpected}]`, specification);
	}
	similar(actual, expected, message, specification) {
		Object.equals(actual, expected) ? this.success(message, specification) : this.fail(`${message}: Actual [${actual}] - Expected [${expected}]`, specification);
	}
	notSimilar(actual, notExpected, message, specification) {
		!Object.equals(actual, notExpected) ? this.success(message, specification) : this.fail(`${message}: Actual [${actual}] - Not expected [${notExpected}]`, specification);
	}
	defined(value, message, specification) {
		this.notEqual(value, undefined, message, specification);
	}
	undefined(value, message, specification) {
		this.equal(value, undefined, message, specification);
	}
	null(value, message, specification) {
		this.equal(value, null, message, specification);
	}
	notNull(value, message, specification) {
		this.notEqual(value, null, message, specification);
	}
	ok(assertion, message, specification) {
		this.equal(assertion, true, message, specification);
	}
	notOk(assertion, message, specification) {
		this.equal(assertion, false, message, specification);
	}
	doesThrow(block, exception_assert, message, specification) {
		try {
			block.call();
			this.fail(message || 'Code does not throw an exception', specification);
		}
		catch(exception) {
			check_exception.call(this, exception, exception_assert, message, specification);
		}
	}
	doesNotThrow(block, message, specification) {
		try {
			block.call();
			this.success(message || 'Code does not throw an exception', specification);
		}
		catch(exception) {
			this.fail(`${message}: Code throws an exception: ${exception}`, specification);
		}
	}
	async doesThrowAsync(block, exception_assert, message, specification) {
		try {
			await block.call();
			this.fail(message || 'Code does not throw an exception', specification);
		}
		catch(exception) {
			check_exception.call(this, exception, exception_assert, message, specification);
		}
	}
	async doesNotThrowAsync(block, message, specification) {
		try {
			await block.call();
			this.success(message || 'Code does not throw an exception', specification);
		}
		catch(exception) {
			this.fail(`${message}: Code throws an exception: ${exception}`, specification);
		}
	}
	all(executor, message, specification) {
		const assert = new Assert();
		assert.begin();
		executor.call(undefined, assert);
		if(assert.counters.fails === 0) {
			this.success(message || 'All assertions succeed', specification);
		}
		else {
			this.success(message || 'One assertion failed', specification);
		}
		assert.end();
	}
}
