import {Bundle} from './bundle.js';

export class Suite {
	constructor(name, path, bundles, runner) {
		this.name = name;
		this.path = path;
		this.bundles = bundles || [];
		this.runner = runner;
		this.beginTime = undefined;
		this.endTime = undefined;
	}
	getAsserts() {
		return this.bundles.map(b => b.assert).filter(a => a !== undefined);
	}
	getTestsNumber() {
		const asserts = this.getAsserts();
		return asserts.reduce((previous, assert) => previous + assert.counters.successes + assert.counters.fails, 0);
	}
	getSuccessesNumber() {
		const asserts = this.getAsserts();
		return asserts.reduce((previous, assert) => previous + assert.counters.successes, 0);
	}
	getFailsNumber() {
		const asserts = this.getAsserts();
		return asserts.reduce((previous, assert) => previous + assert.counters.fails, 0);
	}
	getDuration() {
		//suite may still be running
		const stop = this.endTime || new Date();
		return stop.getTime() - this.beginTime.getTime();
	}
	async run() {
		this.beginTime = new Date();
		for(let i = 0; i < this.bundles.length; i++) {
			await this.runner.run(this.bundles[i]);
		}
		this.endTime = new Date();
		return this;
	}
	static fromJSON(s) {
		//create suite
		const suite = new Suite(s.name, s.path);
		//create bundles
		suite.bundles = s.bundles.map(b => new Bundle(suite, b.dom, b.website, b.test));
		return suite;
	}
}
