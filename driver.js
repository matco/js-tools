function create_data_transfer() {
	let data = {};
	return {
		getData: function(key) {
			return data[key];
		},
		setData: function(key, value) {
			data[key] = value;
			this.types.push(key);
		},
		clearData: function() {
			data = {};
			this.types = [];
		},
		types: [],
		setDragImage: function() {
			//parameters should be image, x and y
			//not implemented
		},
		effectAllowed: undefined,
		dropEffect: undefined
	};
}

function trigger_change(element) {
	const change = new UIEvent('change', {bubbles: true, cancelable: true});
	element.dispatchEvent(change);
}

function trigger_input(element) {
	const input = new InputEvent('input', {bubbles: true, cancelable: true});
	element.dispatchEvent(input);
}

function trigger_keydown(element, key) {
	const keydown = new KeyboardEvent('keydown', {key: key, bubbles: true, cancelable: true});
	element.dispatchEvent(keydown);
}

function trigger_keypress(element, key) {
	const keydown = new KeyboardEvent('keypress', {key: key, bubbles: true, cancelable: true});
	element.dispatchEvent(keydown);
}

function trigger_keyup(element, key) {
	const keydown = new KeyboardEvent('keyup', {key: key, bubbles: true, cancelable: true});
	element.dispatchEvent(keydown);
}

export class Driver {
	constructor(win, doc) {
		this.window = win || window;
		this.document = doc || document;
		this.scripts = [];
	}
	throwError(error) {
		throw new this.window.Error(error);
	}
	//find an element in the page but does not check if it's visible
	async find(selector) {
		return new Promise((resolve, reject) => {
			//exclude empty selector
			if(!selector) {
				this.throwError('A valid selector or a HTMLElement must provided');
				reject();
			}

			//if selector is a string (as it should be), retrieve the associated element in the dom
			if(String.isString(selector)) {
				//try to find element
				const element = this.document.querySelector(selector);
				if(!element) {
					this.throwError('No element match selector ' + selector);
				}
				resolve(element);
			}
			//consider that the selector is already an element
			else {
				resolve(selector);
			}
		});
	}
	//get an element in the page
	//element must be visible except if hidden is set to true in options
	async get(selector, options) {
		const element = await this.find(selector);
		if(!options || !options.hidden) {
			//check if element is visible
			//this is a first quick test that works most of the time, but not for fixed elements
			if(!element.offsetParent) {
				//do advanced check that takes more time but is reliable
				const style = this.window.getComputedStyle(element);
				if(style.display === 'none') {
					this.throwError('Element is not visible ' + selector);
				}
			}
		}
		return element;
	}
	async getShadow(selector, shadow_selector, options) {
		const element = await this.get(selector, options);
		return element.shadowRoot.querySelector(shadow_selector);
	}
	async getByText(selector, text) {
		const element = await this.get(selector);
		const children = element.children;
		return children.find(c => c.textContent === text) || children.find(async c => await this.getByText(c, text));
	}
	async getValue(selector) {
		const element = await this.get(selector);
		return element.value;
	}
	async getValueShadow(selector, shadow_selector) {
		const element = await this.getShadow(selector, shadow_selector);
		return element.value;
	}
	async getStyle(selector, style) {
		const element = await this.find(selector);
		return element.style[style];
	}
	async eval(selector, evaluator, options) {
		return evaluator.call(this.window, await this.get(selector, options));
	}
	async evalShadow(selector, shadow_selector, evaluator, options) {
		return evaluator.call(this.window, await this.getShadow(selector, shadow_selector), options);
	}
	async focus(selector) {
		const element = await this.get(selector);
		element.focus();
	}
	async click(selector, options) {
		const element = await this.get(selector, options);
		element.focus();
		const click = new MouseEvent('click', {view: this.window, bubbles: true, cancelable: true, detail: 1});
		element.dispatchEvent(click);
	}
	async doubleClick(selector) {
		const element = await this.get(selector);
		const dblclick = new MouseEvent('dblclick', {view: this.window, bubbles: true, cancelable: true, detail: 1});
		element.dispatchEvent(dblclick);
	}
	async rightClick(selector) {
		const element = await this.get(selector);
		const contextmenu = new MouseEvent('contextmenu', {view: this.window, bubbles: true, cancelable: true, detail: 1});
		element.dispatchEvent(contextmenu);
	}
	async dragAndDrop(draggable_selector, droppable_selector) {
		const draggable = await this.get(draggable_selector);
		const droppable = await this.get(droppable_selector);
		const data_transfer = create_data_transfer();

		const dragstart = new MouseEvent('DragEvent');
		dragstart.initEvent('dragstart', true, true);
		dragstart.dataTransfer = data_transfer;
		draggable.dispatchEvent(dragstart);

		const dragenter = new MouseEvent('DragEvent');
		dragenter.initEvent('dragenter', true, true);
		dragenter.dataTransfer = data_transfer;
		droppable.dispatchEvent(dragenter);

		const drop = new MouseEvent('DragEvent');
		drop.initEvent('drop', true, true);
		drop.dataTransfer = data_transfer;
		droppable.dispatchEvent(drop);

		const dragend = new MouseEvent('DragEvent');
		dragend.initEvent('dragend', true, true);
		dragend.dataTransfer = data_transfer;
		draggable.dispatchEvent(dragend);

		//TODO use following code as soon as possible
		/*var dragstart_event = new DragEvent('dragstart');
		console.log(dragstart_event.dataTransfer);
		draggable.dispatchEvent(dragstart_event);

		var dragenter_event = new DragEvent('dragenter');
		droppable.dispatchEvent(dragenter_event);

		var drop_event = new DragEvent('drop');
		droppable.dispatchEvent(drop_event);

		var dragend_event = new DragEvent('dragend');
		draggable.dispatchEvent(dragend_event);*/
	}
	//forms
	async type(selector, value) {
		const element = await this.get(selector);
		element.value = value;
		//trigger change event manually because it is not fired by the browser when the value is set with js
		trigger_change(element);
		trigger_input(element);
	}
	async check(selector) {
		const element = await this.get(selector);
		element.checked = true;
		trigger_change(element);
	}
	async uncheck(selector) {
		const element = await this.get(selector);
		element.checked = false;
		trigger_change(element);
	}
	async submit(selector) {
		const element = await this.get(selector);
		const submit = this.document.createEvent('Event');
		submit.initEvent('submit', true, true);
		element.dispatchEvent(submit);
		//submit event could throw an exception if form is not valid
	}
	//sequence must be an array of key like explained here https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
	//that means you can send letters or digits directly such as "0", "4", "a" or "h" but not "Number0", "Number4", "KeyQ" or "KeyH"
	//you can also send other keys such as "Escape", "F2", "PageDown"
	//a valid sequence is ['a', 'Escape', 'q', '5', 'PageDown']
	//this code does not manage modifier keys (such as "Ctrl", "Alt" or "Shift") and only set the key property of the event (and not the code property)
	async press(sequence, selector) {
		//keys are usually sent on the whole document element
		const element = selector ? await this.get(selector) : this.document;
		sequence.forEach(k => {
			trigger_keydown(element, k);
			trigger_keypress(element, k);
			trigger_keyup(element, k);
		});
	}
	async wait(time) {
		return new Promise(resolve => {
			const timeout = time || 100;
			this.window.setTimeout(resolve, timeout);
		});
	}
}
