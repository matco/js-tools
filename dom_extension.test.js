'use strict';

assert.begin();

//node
(function() {
	var div = document.createElement('div');

	//add random nodes
	div.appendChild(document.createElement('span'));
	div.appendChild(document.createElement('span'));
	div.appendChild(document.createTextNode('hop'));
	assert.equal(div.childNodes.length, 3, 'There is 3 child nodes in newly created container');
	div.clear();
	assert.equal(div.childNodes.length, 0, 'There is 0 child node in container after it has been cleared');

	//add text node
	div.appendChild(document.createTextNode('hop'));
	assert.equal(div.childNodes.length, 1, 'There is 1 child text node in container');
	div.clear();
	assert.equal(div.childNodes.length, 0, 'There is 0 child text node in container after it has been cleared');
})();

(function() {
	var div = document.createElement('div');

	//add random nodes
	assert.equal(div.childNodes.length, 0, 'There is 0 child node in newly created container');
	div.appendChildren([document.createElement('span'), document.createElement('span')]);
	assert.equal(div.childNodes.length, 2, 'There is 2 child nodes in container after 2 child nodes have been added');

	//add text node
	div.appendChildren([document.createTextNode('hop')]);
	assert.equal(div.childNodes.length, 3, 'There is 3 child nodes in container after 1 child text node has been added');
})();

//element
(function() {
	var a = document.createElement('a');

	assert.notOk(a.hasAttribute('href'), 'Newly created link has no attribute "href"');

	//add some attributes
	a.setAttributes({href : '#here', 'class' : 'important', style : 'border: 1px solid black;'});

	assert.ok(a.hasAttribute('href'), 'Link has attribute "href"');
	assert.ok(a.hasAttribute('class'), 'Link has attribute "class"');
	assert.equal(a.getAttribute('href'), '#here', 'Attribute "href" has been set with good value');
	assert.equal(a.getAttribute('class'), 'important', 'Attribute "class" has been set with good value');

	//overwrite one attribute and add a new one
	a.setAttributes({'class' : 'useless', title : 'Useless link'});

	assert.equal(a.getAttribute('class'), 'useless', 'Attribute "class" has been overriden with good value');
	assert.equal(a.getAttribute('title'), 'Useless link', 'Attribute "title" has been set with good value');

})();

//document
(function() {
	var clicked = false;
	var button = document.createFullElement(
		'button',
		{type : 'button', 'class' : 'important', style : 'cursor: pointer;'},
		'Here',
		{
			click : function(event) {
				event.preventDefault();
				clicked = true;
			}
		}
	);

	assert.equal(button.nodeName, 'BUTTON', 'Button has been created');
	assert.equal(button.getAttribute('class'), 'important', 'Button "class" has been set with good value');
	assert.equal(button.textContent, 'Here', 'Button text has been set with good text');
	assert.notOk(clicked, 'Button has not been clicked yet');
	button.click();
	assert.ok(clicked, 'Button listener has been set successfully');
})();

//form
(function() {
	var form = document.createElement('form');
	var input = document.createFullElement('input', {name : 'value_1'});
	var select = document.createFullElement('select', {name : 'value_2'});
	var button_submit = document.createFullElement('button', {type : 'submit'}, 'Submit');
	var button_close = document.createFullElement('button', {type : 'button'}, 'Close');
	var p = document.createFullElement('p', {}, 'Form errors placeholder');
	form.appendChildren([input, select, button_submit, button_close, p]);

	form.disable();
	assert.ok(input.hasAttribute('disabled'), 'Input field has been disabled');
	assert.ok(select.hasAttribute('disabled'), 'Select field has been disabled');
	assert.ok(button_submit.hasAttribute('disabled'), 'Submit button has been disabled');
	assert.ok(button_close.hasAttribute('disabled'), 'Normal button has been disabled');
	assert.notOk(p.hasAttribute('disabled'), 'Paragraph element has not been disabled');

	form.enable();
	assert.notOk(input.hasAttribute('disabled'), 'Input field has been enabled');
	assert.notOk(select.hasAttribute('disabled'), 'Select field has been enabled');
	assert.notOk(button_submit.hasAttribute('disabled'), 'Submit button has been enabled');
	assert.notOk(button_close.hasAttribute('disabled'), 'Normal button has been enabled');
	assert.notOk(p.hasAttribute('disabled'), 'Paragraph has never been disabled');
})();

//storage
var city = {
	name : 'Geneva',
	population : 500000,
	country : 'Switzerland'
};
localStorage.setObject('city', city);
assert.equal(localStorage.getObject('city').name, 'Geneva', 'Store city object in local storage and retrieve city name to obtain "Geneva"');
assert.equal(localStorage.getObject('city').population, 500000, 'Store city object in local storage and retrieve city population to obtain 500000');
assert.equal(localStorage.getItem('city'), '{"name":"Geneva","population":500000,"country":"Switzerland"}', 'Store city object in local storage and retrieve it');
localStorage.removeItem('city');

assert.end();