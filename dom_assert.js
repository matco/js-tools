import {Assert} from './assert.js';

export class DOMAssert extends Assert {
	constructor(doc, onAssert, onSuccess, onFail, onBegin, onEnd, debug) {
		super(onAssert, onSuccess, onFail, onBegin, onEnd, debug);
		this.document = doc || document;
	}
	get(selector) {
		return String.isString(selector) ? this.document.querySelector(selector) : selector;
	}
	selectContains(selector, value, message) {
		const element = this.get(selector);
		if(element.childNodes.find(n => n.getAttribute('value') === value)) {
			this.success(message || (`Select contains ${value}`));
		}
		else {
			this.fail(message || (`Select does not contain ${value}`));
		}
	}
	selectNotContains(selector, value, message) {
		const element = this.get(selector);
		if(element.childNodes.find(n => n.getAttribute('value') === value)) {
			this.fail(message || (`Select contains ${value}`));
		}
		else {
			this.success(message || (`Select does not contain ${value}`));
		}
	}
	hidden(selector, message) {
		const element = this.get(selector);
		//check inline style
		if(element.style.display === 'none' || element.style.visibility === 'hidden') {
			this.success(message || 'Element is hidden');
			return;
		}
		//check css
		const css = this.document.defaultView.getComputedStyle(element, undefined);
		if(css.getPropertyValue('display') === 'none' || css.getPropertyValue('visibility') === 'hidden') {
			this.success(message || 'Element is hidden');
			return;
		}
		this.fail(message || 'Element is not hidden');
	}
	visible(selector, message) {
		const element = this.get(selector);
		//check css
		const css = this.document.defaultView.getComputedStyle(element, undefined);
		if(css.getPropertyValue('display') !== 'none' && css.getPropertyValue('visibility') !== 'hidden') {
			//check inline style
			if(element.style.display !== 'none' && element.style.visibility !== 'hidden') {
				this.success(message || 'Element is visible');
				return;
			}
		}
		this.fail(message || 'Element is not visible');
	}
}
