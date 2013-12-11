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

document

assert.end();