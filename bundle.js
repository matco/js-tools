'use strict';

function Bundle(suite, dom, website, dependencies, test, onassert) {
	this.suite = suite;
	this.dom = dom;
	this.website = website;
	this.dependencies = dependencies;
	this.test = test;

	this.onassert = onassert;
}

Bundle.prototype.run = function(doc) {
	var that = this;

	return new Promise(function(resolve, reject) {

		//create assert in this context
		that.assert = new Assert(
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

		//create iframe to sandbox each test
		var iframe = doc.createElement('iframe');
		iframe.setAttribute('sandbox', 'allow-same-origin allow-top-navigation allow-forms allow-scripts allow-modals');
		if(that.website) {
			//load website and show iframe
			iframe.setAttribute('src', (that.suite.path || '') + that.website);
			iframe.setAttribute('width', '90%');
			iframe.setAttribute('height', '90%');
			iframe.setAttribute('style', 'position: fixed; top: 5%; left: 5%; display: none; z-index: 1000; border: 2px solid #666; background-color: white;');
		}
		else {
			var html = "<!DOCTYPE html><html><head><meta charset='UTF-8' /></head><body></body></html>";
			iframe.srcdoc = html;
			iframe.setAttribute('width', '0');
			iframe.setAttribute('height', '0');
			iframe.setAttribute('style', 'display: none;');
		}

		iframe.addEventListener(
			'load',
			function() {
				//manage dependencies
				var dependencies_paths = that.dependencies.map(d => (that.suite.path || '') + d);
				//create loader
				var loader = new Loader(iframe.contentDocument);
				//TODO try to load them together
				loader.loadQueuedLibraries(dependencies_paths).then(function() {
					//configure and give assert
					that.assert.document = iframe.contentDocument;
					iframe.contentWindow.assert = that.assert;
					//give tester for website
					if(that.website) {
						new Tester(iframe.contentWindow, iframe.contentDocument).globalize(iframe.contentWindow);
					}
					loader.loadLibrary((that.suite.path || '') + that.test);
				});
			}
		);

		document.body.appendChild(iframe);
	});
}