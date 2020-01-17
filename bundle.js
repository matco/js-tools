import {Loader} from './loader.js';
import {DOMAssert} from './dom_assert.js';
import {Driver} from './driver.js';

export class Bundle {
	constructor(suite, dom, website, dependencies, test, onassert) {
		this.suite = suite;
		this.dom = dom;
		this.website = website;
		this.dependencies = dependencies || [];
		this.test = test;
		this.assert = undefined;
		this.onassert = onassert;
	}
	run() {
		const that = this;

		return new Promise(function(resolve) {
			//create iframe to sandbox each test
			const iframe = document.createElement('iframe');
			iframe.setAttribute('sandbox', 'allow-same-origin allow-top-navigation allow-forms allow-scripts allow-modals');
			if(that.website) {
				//load website and show iframe
				iframe.setAttribute('src', (that.suite.path || '') + that.website);
				iframe.setAttribute('width', '90%');
				iframe.setAttribute('height', '90%');
				iframe.setAttribute('style', 'position: fixed; top: 5%; left: 5%; display: none; z-index: 1000; border: 2px solid #666; background-color: white;');
			}
			else {
				const html = '<!DOCTYPE html><html><head><meta charset=\'UTF-8\' /></head><body></body></html>';
				iframe.srcdoc = html;
				iframe.setAttribute('width', '0');
				iframe.setAttribute('height', '0');
				iframe.setAttribute('style', 'display: none;');
			}
			iframe.addEventListener(
				'load',
				function() {
					//manage paths for dependencies and test
					const dependencies_paths = that.dependencies.map(d => (that.suite.path || '') + d);
					const test_path = (that.suite.path || '') + that.test;
					//create assert in this context
					that.assert = new DOMAssert(
						iframe.contentDocument,
						function(message, specification) {
							that.suite.counters.successes++;
							that.onassert(that.assert, 'success', message, specification);
						},
						function(message, specification) {
							that.suite.counters.fails++;
							that.onassert(that.assert, 'fail', message, specification);
						},
						function() {
							if(that.website) {
								iframe.style.display = 'block';
							}
						},
						function() {
							if(that.website) {
								iframe.style.display = 'none';
							}
							resolve(that);
						}
					);
					//configure assert and driver
					//TODO remove this
					iframe.contentWindow.assert = that.assert;
					iframe.contentWindow.driver = new Driver(iframe.contentWindow, iframe.contentDocument);
					//create testing script dynamically
					const launch_test_code =
					`
						import('${test_path}').then(t => {
							if(t.default) {
								t.default(assert, driver);
							}
							else {
								console.error('Test module must contain a default export function. Are you sure this is a test?');
							}
						});
					`;
					//create loader to load native dependencies that are not modules
					const loader = new Loader(iframe.contentDocument);
					loader.loadQueuedLibraries(dependencies_paths).then(() => {
						//import in a statement and not a function
						//it can not be called in the context of the iframe without using eval
						iframe.contentWindow.eval(launch_test_code);
					});
				}
			);
			document.body.appendChild(iframe);
		});
	}
}
