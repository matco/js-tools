export class Bundle {
	constructor(suite, dom, website, test, onAssert, onBegin, onEnd) {
		this.suite = suite;
		this.dom = dom;
		this.website = website;
		this.test = test;
		this.assert = undefined;
		this.onAssert = onAssert;
		this.onBegin = onBegin;
		this.onEnd = onEnd;
	}
}
