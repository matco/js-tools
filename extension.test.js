/* eslint no-new-wrappers: "off" */

'use strict';

assert.begin();

//Object
//isObject
(function() {
	const object = {toto : 'tutu'};
	const func = function() {'nothing to do';};
	const not_func = 'nothing';

	assert.ok(Object.isObject(object), 'An object variable is an object');
	assert.ok(Object.isObject({toto : 'titi'}), 'An anonymous object is an object');
	assert.ok(Object.isObject({}), 'An empty object is an object');
	assert.notOk(Object.isObject(func), 'A function variable is not an object');
	assert.notOk(Object.isObject('nothing'), 'A string is not an object');
	assert.notOk(Object.isObject(not_func.toString), 'toString method of string is not an object');
	assert.notOk(Object.isObject([]), 'Empty array is not an object');
})();

//isEmpty
(function() {
	assert.ok(Object.isEmpty({}), 'Anonymous object {} is an empty object');
	assert.notOk(Object.isEmpty({toto : undefined}), '{toto : undefined} is not an empty object');

	let object = {};
	assert.ok(Object.isEmpty(object), 'Variable containing {} is an empty object');

	let constructor = function() {};
	object = new constructor();
	assert.ok(Object.isEmpty(object), 'Object built from empty constructor is an empty object');

	constructor = function() {
		this.property;
	};
	object = new constructor();
	assert.ok(Object.isEmpty(object), 'Object built from constructor defining property without value is an empty object');

	constructor = function() {
		this.property = 'value';
	};
	object = new constructor();
	assert.notOk(Object.isEmpty(object), 'Object built from constructor defining property and its value is not an empty object');
})();

//equals
(function() {
	assert.ok(Object.equals(1, 1), '1 is equal to 1');
	assert.notOk(Object.equals(1, '1'), '1 is not equal to "1"');
	assert.ok(Object.equals('toto', 'toto'), '"toto" is equal to "toto"');
	assert.notOk(Object.equals('toto', 'titi'), '"toto" is equal to "titi"');
	assert.ok(Object.equals('', ''), '"" is equal to ""');
	assert.ok(Object.equals(undefined, undefined), 'undefined is equal to undefined');
	assert.ok(Object.equals([1,2,3], [1,2,3]), '[1,2,3] is equal to [1,2,3]');
	assert.notOk(Object.equals([1,2,3], [1,2,3,4]), '[1,2,3] is not equal to [1,2,3,4]');
	assert.ok(
		Object.equals(
			{one : 'un', two : 'deux'},
			{one : 'un', two : 'deux'}
		),
		'Two object with same keys (in the same order) and values are equal');
	assert.notOk(
		Object.equals(
			{one : 'un', two : 'deux'},
			{two : 'deux', one : 'un'}
		),
		'Two object with same keys (in a different order) and values are not equal');
	assert.ok(
		Object.equals(
			{property : 'value', other_property : ['toto', 'titi']},
			{property : 'value', other_property : ['toto', 'titi']}
		),
		'Object containing string and array is equal to an other object containing an equal string and an equal array');

	const value = [1,2,'tutu'];
	assert.ok(Object.equals({property : value}, {property : value}), 'Object containing an array is equal to an other object containing the same array');
})();

//clone
(function() {
	let object = {property : 'value'};
	let cloned_object = Object.clone(object);

	assert.ok(cloned_object.hasOwnProperty('property'), 'Cloned object has the same property like the original');
	assert.equal(cloned_object.property, object.property, 'Cloned object property has the same value than the original object property');
	const constructor = function() {
		this.property = 'value';
	};
	constructor.prototype.doNothing = function() {
		'nothing to do';
	};
	object = new constructor();
	cloned_object = Object.clone(object);
	assert.ok(cloned_object.hasOwnProperty('property'), 'Cloned object has the same property like the original');
	assert.equal(cloned_object.property, object.property, 'Cloned object property has the same value than the original object property');
	assert.notEqual(object.constructor, cloned_object.constructor, 'Unfortunately, cloned object from object built from a constructor does not share the same constructor than the original');
	assert.ok(Function.isFunction(object.doNothing), 'Original object has a "doNothing" method inherited from prototype chain');
	assert.notOk(Function.isFunction(cloned_object.doNothing), 'Cloned object does not have a "doNothing" method');
})();

//key
(function() {
	assert.equal(Object.key({titi : 'tutu'}, 'tutu'), 'titi', 'Key for a string value is the right key');
	assert.equal(Object.key({titi : 42}, 42), 'titi', 'Key for a number value is the right key');
	assert.doesThrow(
		function() {
			Object.key({titi : 'tutu'}, 'toto');
		},
		function() {
			return this.message === 'Object does not contains value';
		},
		'Asking key for a non existing value throws an exception'
	);

	const embedded_object = {mama : 'momo', mimi : 'mumu'};
	const object = {toto : 'toto', titi :embedded_object};

	assert.equal(Object.key(object, embedded_object), 'titi', 'Key for an object value is the right key');
	assert.doesThrow(
		function() {
			Object.key(object, {mama : 'momo', mimi : 'mumu'});
		},
		function() {
			return this.message === 'Object does not contains value';
		},
		'Asking key for a similar value throws an exception'
	);
})();

//getObjectPathValue and getLastObjectInPath
(function() {
	const family = {
		name : 'Doe'
	};
	assert.equal(Object.getObjectPathValue(family, 'name'), 'Doe', 'Get object path value on object for path "name" gives "John"');
	assert.equal(Object.getObjectPathValue(family, 'age'), undefined, 'Get object path value on object for path "age" gives undefined');
	const person = {
		name : 'John'
	};
	family.chief = person;
	assert.equal(Object.getObjectPathValue(family, 'chief'), person, 'Get object path value on object for path "chief" gives the family chief person');
	assert.equal(Object.getObjectPathValue(family, 'chief.name'), 'John', 'Get object path value on object for path "chief.name" gives "John"');

	const main_shop = {
		name : 'Migros',
		category : 'Supermarket',
		label : function() {
			return this.category + ' ' + this.name;
		}
	};
	const main_street = {
		name : 'Avenue de Champel',
		population : 100,
		shops : [
			main_shop,
			{
				name : 'Pompei',
				category : 'Restaurant'
			}
		],
		main_shop : main_shop
	};
	const city = {
		names : {
			en : 'Geneva',
			fr : 'Genève'
		},
		population : 500000,
		streets : [
			main_street,
			{
				name : 'Rue de Lausanne',
				length : 1000
			}
		],
		main_street : main_street
	};

	assert.equal(Object.getObjectPathValue(city, 'names.en'), 'Geneva', 'Get object path value on city for path "names.en" gives "Geneva"');
	assert.equal(Object.getObjectPathValue(city, 'names.de'), undefined, 'Get object path value on city for path "names.de" gives undefined');
	assert.equal(Object.getObjectPathValue(city, 'main_street.shops'), main_street.shops, 'Get object path value on city for path "main_street.shops" gives all main street shops');
	assert.equal(Object.getObjectPathValue(city, 'main_street.population'), 100, 'Get object path value on city for path "main_street.population" gives the population of the main street');
	assert.equal(Object.getObjectPathValue(city, 'main_street.main_shop.label'), 'Supermarket Migros', 'Get object path value on city for path "main_street.main_shop.label" gives the label od main shop of the main street using a function');

	//TODO does not work yet
	//assert.equal(Object.getObjectPathValue(city, 'streets[0].shops[0].name'), 'Migros', 'Get object path value on object for path "streets[0].shops[0].name" gives the population of the name of the first shop inf the first street');

	assert.equal(Object.getLastObjectInPath(city, 'names.en').object, city.names, 'Get last object in path "names.en" gives the names object');
	assert.equal(Object.getLastObjectInPath(city, 'names.en').property, 'en', 'Get last object in path "names.en" gives the "en" property');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.population').object, main_street, 'Get last object in path "main_street.population" gives the main street object');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.population').property, 'population', 'Get last object in path "main_street.population" gives the "population" property');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.shops.length').object, main_street.shops, 'Get last object in path "main_street.shops.length" gives the array of shops in the main street object');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.shops.length').property, 'length', 'Get last object in path "main_street.shops.length" gives the "length" property');
})();

//Function
//isFunction
(function() {
	const func = function() {'nothing to do';};
	const not_func = 'nothing';

	assert.ok(Function.isFunction(func), 'A function variable is a function');
	assert.ok(Function.isFunction(function() {}), 'An empty anonymous function is a function');
	assert.ok(Function.isFunction(function() {'function';}), 'An anonymous function is a function');
	assert.notOk(Function.isFunction(not_func), 'A string is not a function');
	assert.ok(Function.isFunction(not_func.toString), 'toString method of string is a function');
	assert.ok(Function.isFunction(func.constructor), 'Function constructor is a function');
	assert.notOk(Function.isFunction(String.capitalize), 'Static capitalize property of String is not a function');
	assert.ok(Function.isFunction(String.prototype.capitalize), 'capitalize method of String prototype is a function');
	assert.notOk(Function.isFunction({}), 'Empty object is not a function');
	assert.notOk(Function.isFunction([]), 'Empty array is not a function');
})();

//negatize
(function() {
	function is_odd(number) {
		return number % 2 === 0;
	}
	assert.ok(is_odd(2), '2 is odd according to function is_odd');
	assert.notOk(is_odd(5), '5 is not odd to function is_odd');
	const is_even = is_odd.negatize();
	assert.notOk(is_even(2), '2 is not even according to negatized function is_odd');
	assert.ok(is_even(5), '5 is even according to negatized function is_odd');
})();

//callbackize
(function() {
	const text = 'toto';
	assert.equal(String.prototype.toUpperCase.callbackize().call(undefined, text), 'TOTO', 'Callbackize transform method function into callable function');
	assert.equal(String.prototype.substring.callbackize(0, 2).call(undefined, text), 'to', 'Callbackize preserves arguments');

	const people = ['Anakin', 'Luke', 'Leia', 'Han'];
	assert.similar(people.map(String.prototype.toUpperCase.callbackize()), ['ANAKIN', 'LUKE', 'LEIA', 'HAN'], 'Callbackize transform method function into callable function which is handy for array functions');
	assert.similar(people.map(String.prototype.substring.callbackize(0, 2)), ['An', 'Lu', 'Le', 'Ha'], 'Callbackize preserves arguments which is handy for array functions');
})();

//memoize
(function() {
	let calculated = false;
	let result;

	//function
	let square = function(value) {
		calculated = true;
		return Math.pow(value, 2);
	};

	//test function
	assert.equal(square(2), 4, '2 square is 4');
	assert.ok(calculated, '2 square has been calculated');

	assert.doesThrow(
		function() {
			square.unmemoize();
		},
		function() {
			return this.message === 'Unable to unmemoize a function that has not been memoized';
		},
		'It is not possible to unmemoize a function which has not been previously memoized'
	);

	square = square.memoize();

	calculated = false;
	result = square(2);
	assert.equal(result, 4, '2 square is 4');
	assert.ok(calculated, 'On first call, 2 square has been calculated');

	calculated = false;
	result = square(3);
	assert.equal(result, 9, '3 square is 9');
	assert.ok(calculated, 'On first call, 3 square has been calculated');

	calculated = false;
	result = square(3);
	assert.equal(result, 9, '3 square is 9');
	assert.notOk(calculated, 'On second call, 3 square has not been calculated');
	result = square(3);
	assert.equal(result, 9, '3 square is 9');
	assert.notOk(calculated, 'On third call, 3 square has not been calculated');

	square = square.unmemoize();

	result = square(2);
	assert.equal(result, 4, '2 square is 4');
	assert.ok(calculated, 'Memoization has been disabled, 2 square has been calculated');

	calculated = false;
	result = square(3);
	assert.equal(result, 9, '3 square is 9');
	assert.ok(calculated, 'Memoization has been disabled, 3 square has been calculated');

	//method
	function Square(size) {
		this.size = size;
	}
	Square.prototype.getArea = function() {
		calculated = true;
		return Math.pow(this.size, 2);
	};

	//test function
	assert.equal(new Square(2).getArea(), 4, 'Area of square of size 2 is 4');
	assert.ok(calculated, 'Area of square has been calculated');

	Square.prototype.getArea = Square.prototype.getArea.memoize();

	assert.doesThrow(
		function() {
			new Square(2).getArea();
		},
		function() {
			return this.message === 'Unable to memoize method in object is not serializable (i.e. it has no serialize method)';
		},
		'It is not possible to memoize a method if its object is not serializable'
	);

	Square.prototype.serialize = function() {
		return this.size;
	};

	calculated = false;
	result = new Square(2).getArea();
	assert.equal(result, 4, 'Area of square of size 2 is 4');
	assert.ok(calculated, 'On first call, area for square of size 2 has been calculated');

	calculated = false;
	result = new Square(3).getArea();
	assert.equal(result, 9, 'Area of square of size 3 is 9');
	assert.ok(calculated, 'On first call, area for square of size 3 has been calculated');

	calculated = false;
	result = new Square(3).getArea();
	assert.equal(result, 9, 'Area of square of size 3 is 9');
	assert.notOk(calculated, 'On second call, area for square of size 3 has not been calculated');

	result = new Square(3).getArea();
	assert.equal(result, 9, 'Area of square of size 3 is 8');
	assert.notOk(calculated, 'On third call, area for square of size 3 square has not been calculated');

	Square.prototype.getArea = Square.prototype.getArea.unmemoize();

	result = new Square(2).getArea();
	assert.equal(result, 4, 'Area of square of size 2 is 4');
	assert.ok(calculated, 'Memoization has been disabled, area for square of size 2 has been calculated');

	calculated = false;
	result = new Square(3).getArea();
	assert.equal(result, 9, 'Area of square of size 3 is 9');
	assert.ok(calculated, 'Memoization has been disabled, area for square of size 3 has been calculated');

	//method with parameter
	Square.prototype.getCuboidVolume = function(height) {
		calculated = true;
		return this.getArea() * height;
	};

	Square.prototype.getCuboidVolume = Square.prototype.getCuboidVolume.memoize();

	calculated = false;
	result = new Square(2).getCuboidVolume(3);
	assert.equal(result, 12, 'Cuboid volume of square of size 2 and height 3 is 12');
	assert.ok(calculated, 'On first call, cuboid volume has been calculated');

	calculated = false;
	result = new Square(2).getCuboidVolume(4);
	assert.equal(result, 16, 'Cuboid volume of square of size 2 and height 4 is 16');
	assert.ok(calculated, 'On first call, cuboid volume has been calculated');

	calculated = false;
	result = new Square(3).getCuboidVolume(3);
	assert.equal(result, 27, 'Cuboid volume of square of size 3 and height is 27');
	assert.ok(calculated, 'On first call, cuboid volume has been calculated');

	calculated = false;
	result = new Square(2).getCuboidVolume(4);
	assert.equal(result, 16, 'Cuboid volume of square of size 2 and height 4 is 16');
	assert.notOk(calculated, 'On second call, acuboid volume has not been calculated');

	calculated = false;
	result = new Square(3).getCuboidVolume(3);
	assert.equal(result, 27, 'Cuboid volume of square of size 3 and height is 27');
	assert.notOk(calculated, 'On second call, cuboid volume has not been calculated');

	calculated = false;
	result = new Square(3).getCuboidVolume(3);
	assert.equal(result, 27, 'Cuboid volume of square of size 3 and height is 27');
	assert.notOk(calculated, 'On third call, cuboid volume square has not been calculated');

	Square.prototype.getCuboidVolume = Square.prototype.getCuboidVolume.unmemoize();

	result = new Square(2).getCuboidVolume(3);
	assert.equal(result, 12, 'Cuboid volume of square of size 2 and height 3 is 12');
	assert.ok(calculated, 'Memoization has been disabled, cuboid volume square has been calculated');

	calculated = false;
	result = new Square(3).getCuboidVolume(3);
	assert.equal(result, 27, 'Cuboid volume of square of size 3 and height is 27');
	assert.ok(calculated, 'Memoization has been disabled, cuboid volume square has been calculated');

})();

//String
//capitalize
(function() {
	assert.equal('rodanotech'.capitalize(), 'Rodanotech', 'Capitalize "rodanotech" gives "Rodanotech"');
	assert.equal('RODANOTECH'.capitalize(), 'RODANOTECH', 'Capitalize "RODANOTECH" gives "RODANOTECH"');
	assert.equal('rODANOTECH'.capitalize(), 'RODANOTECH', 'Capitalize "rODANOTECH" gives "RODANOTECH"');
	assert.equal('rodanotech sarl'.capitalize(), 'Rodanotech sarl', 'Capitalize "rodanotech sarl" gives "Rodanotech sarl"');
	assert.equal('rodanotech sArL'.capitalize(), 'Rodanotech sArL', 'Capitalize "rodanotech sArL" gives "Rodanotech sArL"');
	assert.equal(''.capitalize(), '', 'Capitalize "" gives ""');
	const string = 'abçdé';
	const string_capitalized = string.capitalize();
	assert.equal(string, 'abçdé', 'Capitalize create a new string');
	assert.notEqual(string, string_capitalized, 'Capitalize create a new string');
})();

//reverse
(function() {
	assert.equal('ab', 'ba'.reverse(), 'Reverse of "ab" is "ba"');
	assert.notEqual('ab', 'baba'.reverse(), 'Reverse of "ab" is not "baba"');
	assert.equal('1true3', '3eurt1'.reverse(), 'Reverse works with any character');
	assert.equal('-', '-'.reverse(), 'Reverse works with any character');

	const rodano = new String('rodano');

	assert.equal('onador', rodano.reverse(), 'Reverse of "rodano" is "onador"');
	assert.equal('rodano', rodano.reverse().reverse(), '"rodano" reversed two times is "rodano"');
	assert.notEqual(rodano, rodano.reverse().reverse(), 'Reverse of reversed string is not the same string');
})();

//nocaseIncludes
(function() {
	const rodano = 'rodano';

	assert.ok('rodano'.nocaseIncludes('o'), '"rodano" contains "o" without case check');
	assert.ok('rodano'.nocaseIncludes('R'), '"rodano" contains "R" without case check');
	assert.ok('rodano'.nocaseIncludes('DaNo'), '"rodano" contains "DaNo" without case check');
	assert.notOk('rodano'.nocaseIncludes('DaNoN'), '"rodano" does not contains "DaNoN" without case check');
	assert.ok(rodano.nocaseIncludes('od'), '"rodano" contains "od" without case check');
	assert.ok(rodano.nocaseIncludes('RO'), '"rodano" contains "RO" without case check');
})();

assert.ok('alpha'.compareTo('beta') < 0, '"alpha" is lower than "beta"');
assert.ok('beta'.compareTo('alpha') > 0, '"beta" is higher than "alpha"');
assert.ok('a'.compareTo('beta') < 0, '"a" is lower than "beta"');
assert.equal('alpha'.compareTo('alpha'), 0, '"alpha" compare to "alpha" is 0');
assert.ok(''.compareTo('alpha') < 0, '"" is lower than "alpha"');

assert.equal('Welcome ${name}'.replaceObject({'name' : 'Mat'}), 'Welcome Mat', 'ReplaceObject fill blanks with object properties');
assert.equal(
	'Welcome ${name}. I am happy to see you, ${name}.'.replaceObject({'name' : 'Mat', 'other' : 'Matthieu'}),
	'Welcome Mat. I am happy to see you, Mat.',
	'ReplaceObject can replace more than one blank with the same object properties');
assert.equal(
	'Cool ${what} : $, { or } or even {}.'.replaceObject({'what' : 'characters', 'test' : 'test'}),
	'Cool characters : $, { or } or even {}.',
	'ReplaceObject works with any character');
assert.equal(
	'Welcome ${person.firstame} ${person.lastname} or ${surname}'.replaceObject({'person' : {firstame : 'John', lastname: 'Doe'}, 'surname' : 'Jdo'}),
	'Welcome John Doe or Jdo',
	'ReplaceObject fill blanks with object path');
assert.equal(
	'Welcome ${person.firstame.reverse} ${person.lastname.reverse} or ${surname.reverse}'.replaceObject({'person' : {firstame : 'John', lastname: 'Doe'}, 'surname' : 'Jdo'}),
	'Welcome nhoJ eoD or odJ',
	'ReplaceObject fill blanks with object path containing a method');
assert.equal(
	'Welcome ${person.firstame.reverse.reverse}'.replaceObject({'person' : {firstame : 'John'}}),
	'Welcome John',
	'ReplaceObject fill blanks with object path containing a chain of methods');

//number
assert.notOk(Number.isNumber(''), '"" is not a number');
assert.notOk(Number.isNumber('abcd'), '"abcd" is not a number');
assert.notOk(Number.isNumber('abcd12'), '"abcd12" is not a number');
assert.notOk(Number.isNumber('12abcd'), '"12abcd" is not a number');
assert.ok(Number.isNumber(0), '0 is a number');
assert.ok(Number.isNumber(12), '12 is a number');
assert.ok(Number.isNumber(2.5), '2.5 is a number');
assert.ok(Number.isNumber('012'), '"012" is a number');
assert.ok(Number.isNumber('012.0'), '"012.0" is a number');
assert.ok(Number.isNumber('2.5'), '"2.5" is a number');
assert.notOk(Number.isNumber('2,5'), '"2,5" is not a number');

assert.equal((3).pad(3), '003', 'Pad 3 for 3 is "003"');
assert.equal((42).pad(8), '00000042', 'Pad 8 for 42 is "00000042"');
assert.equal((42).pad(1), '42', 'Pad 1 for 42 is "42"');
assert.equal((42).pad(-1), '42', 'Pad -1 for 42 is "42"');

//Array
//isEmpty
assert.ok(new Array().isEmpty(), 'A new array is empty');
assert.ok([].isEmpty(), 'Array type is empty when created');
assert.notOk(new Array(1, 2).isEmpty(), 'New array [1, 2] is not empty');
assert.notOk(['a', 'b'].isEmpty(), 'Array type initialized with values is not empty');

assert.notEqual([1,2,3], [1,2,3], 'New array [1,2,3] is not equals to an other new array [1,2,3]');

//remove
(function() {
	let array;
	array = [1,2,3,4];
	array.remove(1);
	assert.similar(array, [1,3,4], 'Remove (1) on array [1,2,3,4] gives array [1,3,4]');

	array = new Array(1,2,3,4);
	array.remove(1);
	assert.similar(array, [1,3,4], 'Remove (1) on object array [1,2,3,4] gives array [1,3,4]');

	array = [1,2,3,4];
	array.remove(0, 2);
	assert.similar(array, [4], 'Remove (0,2) to array [1,2,3,4] gives array [4]');
})();

//includes all
(function() {
	const array = ['toto', 'titi', 'tutu'];

	assert.ok(array.includesAll(['titi', 'tutu']), 'Array ["toto","titi","tutu"] contains all ["titi","tutu"]');
	assert.ok(array.includesAll(['toto', 'titi', 'tutu']), 'Array ["toto","titi","tutu"] contains all ["toto","titi","tutu"]');
	assert.ok(array.includesAll([]), 'Array ["toto","titi","tutu"] contains all []');
	assert.notOk(array.includesAll(['toto', 'titi', 'tutu', 'tata']), 'Array ["toto","titi","tutu"] does not contain all ["toto","titi","tutu","tata"]');
	assert.notOk(array.includesAll(['toto', 'tata']), 'Array ["toto","titi","tutu"] does not contain all ["toto","tata"]');
	assert.notOk(array.includesAll(['tata']), 'Array ["toto","titi","tutu"] does not contain ["tata"]');
})();

//includes one
(function() {
	const array = ['toto', 'titi', 'tutu'];

	assert.ok(array.includesOne(['titi', 'tata']), 'Array ["toto","titi","tutu"] contains one of ["titi","tata"]');
	assert.notOk(array.includesOne([]), 'Array ["toto","titi","tutu"] does not contains one of []');
	assert.notOk(array.includesOne(['tata', 'tyty']), 'Array ["toto","titi","tutu"] does not contain one of ["tata","tyty"]');
})();

//includes same
(function() {
	const people_1 = {
		firstname : 'Luke',
		lastname : 'Skywalker'
	};
	const people_2 = {
		fistname : 'Han',
		lastname : 'Solo'
	};
	const people_3 = {
		firstame : 'Leia',
		lastname : ' Organa'
	};
	const people_4 = {
		firstname : 'Luke',
		lastname : 'Skywalker'
	};
	const people_5 = {
		firstame : 'Anakin',
		lastname : 'Skywalker'
	};
	const people = [people_1, people_2, people_3];

	assert.ok(people.includesSame(people_3), '"Contains same" function works the same way than "Contains" function with an object which is equal to an object in the array');
	assert.notOk(people.includesSame(people_5), '"Contains same" function works the same way than "Contains" function with an object which is equal to an object in the array');

	assert.notEqual(people_1, people_4, 'Two objects with same properties and values are not equals with the native way');
	assert.ok(Object.equals(people_1, people_4), 'Two objects with same properties and values are equals with the special function "equals"');
	assert.notOk(people.includes(people_4), '"Contains" function does not work with similar objects');
	assert.ok(people.includesSame(people_4), '"Contains same" function works with similar objects');
	assert.ok(people.includesSame({firstname : 'Luke', lastname : 'Skywalker'}), '"Contains same" function works with similar anonymous objects');
	assert.notOk(people.includesSame({firstname : 'Anakin', lastname : 'Skywalker'}), '"Contains same" function does not work with not similar objects');
})();

//removeElement, removeElements and replace
(function() {
	let array = ['toto', 'titi', 'tutu'];
	array.removeElement('tutu');
	assert.similar(array, ['toto', 'titi'], 'Remove element "tutu" to array ["toto","titi","tutu"] gives array ["toto","titi"]');

	array = ['toto', 'titi'];
	array.removeElement('tata');
	assert.similar(array, ['toto', 'titi'], 'Remove an element which is not in the array does not change the array"');

	array = ['toto', 'titi', 'tutu', 'tete'];
	array.removeElements(['titi', 'tete']);
	assert.similar(array, ['toto', 'tutu'], 'Remove elements "titi" and "tete" to array ["toto","titi","tutu", "tete"] gives array ["toto","tutu"]');

	array = ['toto', 'titi', 'tutu', 'tete'];
	array.removeElements(['titi', 'tete', 'tata', 'titi']);
	assert.similar(array, ['toto', 'tutu'], 'Remove some elements including one which is not in the array to an array removes only elements which are in the array"');

	array = ['toto', 'titi'];
	array.replace('titi', 'tata');
	assert.similar(array, ['toto', 'tata'], 'Replace element "titi" by "tata" in array ["toto","titi"] gives array ["toto","tata"]');

	array = ['toto', 'tata'];
	array.replace('titi', 'tata');
	assert.similar(array, ['toto', 'tata'], 'Replace an element which is not is the array does not change the array');
})();

//insert
(function() {
	const array = ['toto', 'titi', 'tutu'];
	let a, b;

	a = array.slice();
	a.insert(0, 'tata');
	assert.similar(a, ['tata', 'toto', 'titi', 'tutu'], 'Insert element at position 0 inserts the element at the beginning of the array');

	a = array.slice();
	b = array.slice();
	a.insert(0, 'tata');
	b.unshift('tata');
	assert.similar(a, b, 'Insert element at position 0 is the same as unshift element');

	a = array.slice();
	a.insert(2, 'tata');
	assert.similar(a, ['toto', 'titi', 'tata', 'tutu'], 'Insert element at position 2 insert the element so it will be at the index 2');

	a = array.slice();
	a.insert(-2, 'tete');
	assert.similar(a, ['toto', 'tete', 'titi', 'tutu'], 'Insert element at a negative position insert element at the specified position but starting from the end of the array');

	a = array.slice();
	a.insert(10, 'tete');
	assert.similar(a, ['toto', 'titi', 'tutu', 'tete'], 'Insert element at a position higher than array length insert the element at the end of the array');

	a = array.slice();
	b = array.slice();
	a.insert(10, 'tete');
	b.push('tete');
	assert.similar(a, b, 'Insert element at a position higher than array length is the same as push element');
})();

//Date
//isDate
(function() {
	assert.ok(Date.isDate(new Date()), 'New date is a date');
	assert.ok(Date.isDate(new Date('3148/12/31')), 'Date [3148/12/31] is a date');
	assert.notOk(Date.isDate({}), 'Empty object is not a date');
	assert.notOk(Date.isDate(1368608924718), 'A timestamp is not a date');
	assert.ok(Date.isDate(new Date('2013/02/38')), 'Invalid date [2013/02/38] is a date');
})();

//isValidDate
(function() {
	assert.ok(Date.isValidDate(new Date()), 'New date is a valid date');
	assert.ok(Date.isValidDate(new Date('3148/12/31')), 'Date [3148/12/31] is a valid date');
	assert.notOk(Date.isValidDate({}), 'Empty object is not a valid date');
	assert.notOk(Date.isValidDate(1368608924718), 'A timestamp is not a valid date');
	assert.ok(Date.isValidDate(new Date(1368608924718)), 'A date built from a timestamp is a valid date');
	assert.notOk(Date.isValidDate(new Date('une date')), 'A date built from string "une date" is not a valid date');
	const date = new Date('2013/04/32');
	assert.ok(!Date.isValidDate(date) || date.getTime() === new Date('2013/05/02').getTime(), 'Date [2013/04/32] is valid date [2013/05/02] for some browsers and is invalid for others browsers');
})();

//compare
(function() {
	assert.ok(new Date('2009/01/01').isBefore(new Date('2009/01/05')), '[2009/01/01] is before [2009/01/05]');
	assert.ok(new Date('2009/01/05').isAfter(new Date('2009/01/01')), '[2009/01/05] is after [2009/01/01]');
	assert.notOk(new Date('2009/01/05').isBefore(new Date('2009/01/01')), '[2009/01/05] is not before [2009/01/05]');
	assert.notOk(new Date('2009/01/01').isAfter(new Date('2009/01/05')), '[2009/01/05] is not after [2009/01/05]');
})();

//equals
(function() {
	assert.notOk(new Date('2009/01/01').equals(new Date('2009/01/05')), '[2009/01/01] is not equals to [2009/01/05]');
	assert.ok(new Date('2009/01/01').equals(new Date('2009/01/01')), '[2009/01/01] is equals to [2009/01/01]');
	assert.notOk(new Date('2009/01/01').equals(undefined), '[2009/01/01] is not equals to undefined date');
})();

assert.equal(new Date('2009/01/25').getMonthName('en'), 'January', 'Month name for date [2009/01/25] in "en" is "January"');
assert.equal(new Date('2009/01/25').getMonthName('fr'), 'Janvier', 'Month name for date [2009/01/25] in "fr" is "Janvier"');
assert.equal(new Date('2009/01/25').getMonthName('de'), 'January', 'Month name for date [2009/01/25] in "de" is "January" because this month has not been translated in German yet');
assert.equal(new Date('2011/10/10').getDayName('en'), 'Monday', 'Day name for date [2011/10/10] is "Monday"');

//toDisplay, toFullDisplay and format
(function() {
	//do not set timezone in date string so Javascript engine will use the timezone of the context, like the toDisplay method
	assert.equal(new Date('2009-01-25T00:00:00').toDisplay(), '25.01.2009', 'Date "2009-01-25T00:00:00" to display is "25.01.2009"');
	assert.equal(new Date('2009-01-25T00:00:00+02:00').toUTCDisplay(), '24.01.2009', 'Date "2009-01-25T00:00:00+02:00" to UTC display is "24.01.2009"');
	assert.equal(new Date('2009-01-25T00:00:00Z').toUTCDisplay(), '25.01.2009', 'Date "2009-01-25T00:00:00Z" to UTC display is "25.01.2009"');

	assert.equal(new Date('2009-01-25T00:00:00').toFullDisplay(), '25.01.2009 00:00:00', 'Date "2009-01-25T00:00:00" to full display is "25.01.2009 00:00:00"');
	assert.equal(new Date('2009-01-25T00:00:00+02:00').toUTCFullDisplay(), '24.01.2009 22:00:00', 'Date "2009-01-25T00:00:00+02:00" to UTC full display is "24.01.2009 22:00:00"');
	assert.equal(new Date('2009-01-25T00:00:00Z').toUTCFullDisplay(), '25.01.2009 00:00:00', 'Date "2009-01-25T00:00:00Z" to UTC full display is "25.01.2009 00:00:00"');

	assert.equal(new Date('2009-01-25T22:38:46.234').toFullDisplay(), '25.01.2009 22:38:46', 'Date "2009-01-25T22:38:46.234" to full display is "25.01.2009 22:38:46"');
	assert.equal(new Date('2009-01-25T22:38:46.234Z').toUTCFullDisplay(), '25.01.2009 22:38:46', 'Date "2009-01-25T22:38:46.234Z" to full display is "25.01.2009 22:38:46"');

	assert.equal(new Date('2009-12-25T22:44').toFullDisplay(), '25.12.2009 22:44:00', 'Date "2009-11-25T22:44" to full display is "25.12.2009 22:38:00"');
	assert.equal(new Date('2009-12-25T22:44Z').toUTCFullDisplay(), '25.12.2009 22:44:00', 'Date "2009-11-25T22:44Z" to full display is "25.12.2009 22:38:00"');

	assert.equal(new Date('2009-01-25T00:00:00').format('${day}.${month}.${year}'), '25.01.2009', 'Date "2009-01-25T00:00:00" formatter with formatter "${day}.${month}.${year}" is "25.01.2009"');
	assert.equal(new Date('2009-01-25T00:00:00+02:00').formatUTC('${day}.${month}.${year}'), '24.01.2009', 'Date "2009-01-25T00:00:00+02:00" formatter with formatter "${day}.${month}.${year}" is "24.01.2009"');
	assert.equal(new Date('2009-01-25T00:00:00Z').formatUTC('${day}.${month}.${year}'), '25.01.2009', 'Date "2009-01-25T00:00:00Z" formatter with formatter "${day}.${month}.${year}" is "25.01.2009"');

	assert.equal(
		new Date('2009-01-25T00:00:00').format('${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}'),
		'25.01.2009 00:00:00:000',
		'Date "2009-01-25T00:00:00" formatted with formatter "${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}" is "25.01.2009 00:00:00:000"');
	assert.equal(
		new Date('2009-12-17T03:24:12').format('${day}.${month}.${year} ${hour}:${minute}:${second}'),
		'17.12.2009 03:24:12',
		'Date "2009-12-17T03:24:12" formatted with formatter "${day}.${month}.${year} ${hour}:${minute}:${second}" is "17.12.2009 03:24:12"');
	assert.equal(
		new Date('2042-06-01T22:20:52.420').format('${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}'),
		'01.06.2042 22:20:52:420',
		'Date "2042-06-01T22:20:52.420" formatted with formatter "${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}" is "01.06.2042 22:20:52:420"');
	assert.equal(
		new Date('2009-01-25T00:00:00').format('Date : ${month}.${day} (month, day)'),
		'Date : 01.25 (month, day)',
		'Date "2009-01-25T00:00:00" formatter with formatter "Date : ${month}.${day} (month, day)" is "Date : 01.25 (month, day)"');
	assert.equal(
		new Date('2009-12-17T19:24:12').format('${hour}$${minute}seconds${second} // Day ${day} of month ${month} in year ${year}'),
		'19$24seconds12 // Day 17 of month 12 in year 2009',
		'Date "2009-12-17T19:24:12" formatted with formatter "${hour}$${minute}seconds${second} // Day ${day} of month ${month} in year ${year}" is "19$$24seconds12 // Day 17 of month 12 in year 2009"');
})();

//parseToDisplay, parseToFullDisplay and parseToFullDisplayUTC
(function() {
	//parseToDisplay
	assert.equal(Date.parseToDisplay('25.01.2009').getTime(), new Date('2009/01/25').getTime(), 'Parsing date "25.01.2009" gives the good date');
	assert.equal(Date.parseToDisplay('5.2.2009').getTime(), new Date('2009/2/5').getTime(), 'Parsing date "5.2.2009" gives the good date');
	assert.notOk(Date.isValidDate(Date.parseToDisplay('25.01.09')), 'Incomplete date "25.01.09" can not be parsed');
	const date = Date.parseToDisplay('33.01.2009');
	assert.ok(!Date.isValidDate(date) || date.getTime() === new Date('2009/02/02').getTime(), 'Parsing date "33.01.2009" gives date [2009/02/02] for some browsers and gives an invalid date for others browsers');

	//parseToFullDisplay
	assert.equal(Date.parseToFullDisplay('25.01.2009 22:38:46').getTime(), new Date(2009, 0, 25, 22, 38, 46).getTime(), 'Parsing date "25.01.2009 22:38:46" gives the good date');
	assert.equal(Date.parseToFullDisplay('25.01.2009 22:62:46').getTime(), new Date(2009, 0, 25, 23, 2, 46).getTime(), 'Parsing date "25.01.2009 22:62:46" gives the good date');
	assert.equal(Date.parseToFullDisplay('25.01.2009 2:6:4').getTime(), new Date(2009, 0, 25, 2, 6, 4).getTime(), 'Parsing date "25.01.2009 2:6:4" gives the good date');
	assert.notOk(Date.isValidDate(Date.parseToFullDisplay('25.01.09 2:6:4')), 'Incomplete date "25.01.09 2:6:4" can not be parsed');

	//parseToFullDisplayUTC
	assert.equal(Date.parseToFullDisplayUTC('25.01.2009 22:38:46').getTime(), new Date(Date.UTC(2009, 0, 25, 22, 38, 46)).getTime(), 'Parsing date "25.01.2009 22:38:46" gives the good date');
	assert.equal(Date.parseToFullDisplayUTC('25.01.2009 22:62:46').getTime(), new Date(Date.UTC(2009, 0, 25, 23, 2, 46)).getTime(), 'Parsing date "25.01.2009 22:62:46" gives the good date');
	let local_date;
	//test with winter time
	local_date = new Date(2014, 1, 25, 10, 42, 30);
	assert.equal(
		Date.parseToFullDisplay('25.01.2014 10:42:30').getTime() - Date.parseToFullDisplayUTC('25.01.2014 10:42:30').getTime(),
		local_date.getTimezoneOffset() * 60 * 1000,
		'Difference between date "25.01.2014 10:42:30" parsed as UTC and the same date parsed as local time is equals to the local timezone offset');
	//test with summer time
	local_date = new Date(2014, 7, 25, 10, 42, 30);
	assert.equal(
		Date.parseToFullDisplay('25.07.2014 10:42:30').getTime() - Date.parseToFullDisplayUTC('25.07.2014 10:42:30').getTime(),
		local_date.getTimezoneOffset() * 60 * 1000,
		'Difference between date "25.07.2014 10:42:30" parsed as UTC and the same date parsed as local time is equals to the local timezone offset');
})();

//toFullDisplay
(function() {
	let date = Date.parseToFullDisplay('20.01.2015 22:42:12');
	date.roundToMinute();
	assert.equal(date.toFullDisplay(), '20.01.2015 22:42:00', 'Rounding date to minute give a date with 0 second');
	date.roundToHour();
	assert.equal(date.toFullDisplay(), '20.01.2015 23:00:00', 'Rounding date to hour give a date with 0 minute');
	date.roundToDay();
	assert.equal(date.toFullDisplay(), '21.01.2015 00:00:00', 'Rounding date to day give a date with 0 hour');

	date = Date.parseToFullDisplay('20.01.2015 12:29:52');
	date.roundToMinute();
	assert.equal(date.toFullDisplay(), '20.01.2015 12:30:00', 'Rounding date to minute give a date with 0 second');
	date.roundToHour();
	assert.equal(date.toFullDisplay(), '20.01.2015 13:00:00', 'Rounding date to hour give a date with 0 minute');
	date.roundToDay();
	assert.equal(date.toFullDisplay(), '21.01.2015 00:00:00', 'Rounding date to day give a date with 0 hour');

	date = Date.parseToFullDisplay('20.01.2015 03:00:12');
	date.roundToDay();
	assert.equal(date.toFullDisplay(), '20.01.2015 00:00:00', 'Rounding date to day give a date with 0 hour');
})();

//add or remove duration
(function() {
	let date = new Date();
	const time = date.getTime();
	date.addSeconds(2);
	assert.equal(date.getTime() - time, 2000, 'Adding 2 seconds is the same as adding 2000 milliseconds');
	assert.ok(date.getTime() - new Date().getTime() > 1998, 'Difference between 2 seconds added to now and now is more than 1998 milliseconds (less than 2ms are required to do the trick)');
	assert.ok(date.getTime() - new Date().getTime() <= 2000, 'Difference between 2 seconds added to now and now is less or equals to 2000 milliseconds (less than 2ms are required to do the trick)');
	date = new Date('2009/01/25');
	date.addDays(3);
	assert.equal(date.getTime(), new Date('2009/01/28').getTime(), 'Add 3 days to [2009/01/25] gives [2009/01/28]');
	date = new Date('2009/01/25');
	date.addDays(-1);
	assert.equal(date.getTime(), new Date('2009/01/24').getTime(), 'Add -1 day to [2009/01/25] gives [2009/01/24]');
	date = new Date('2009/01/25');
	date.addDays(3.8);
	assert.equal(date.toDisplay(), '28.01.2009', 'Add 3.8 days to [2009/01/25] to display is [28.01.2009]');
	date = new Date('2009/01/25');
	date.addDays(4.1);
	assert.equal(date.toDisplay(), '29.01.2009', 'Add 4.1 days to [2009/01/25] to display is [29.01.2009]');
})();

//duration literal
(function() {
	assert.equal(Date.getDurationLiteral(0), '', 'Duration literal for 0 is the empty string');
	assert.equal(Date.getDurationLiteral(2), '2 seconds', 'Duration literal for 2 is "2 seconds"');
	assert.equal(Date.getDurationLiteral(60), '1 minutes', 'Duration literal for 60 is "1 minutes"');
	assert.equal(Date.getDurationLiteral(61), '1 minutes 1 seconds', 'Duration literal for 61 is "1 minutes 1 seconds"');
	assert.equal(Date.getDurationLiteral(179), '2 minutes 59 seconds', 'Duration literal for 179 is "2 minutes 59 seconds"');
	assert.equal(Date.getDurationLiteral(3601), '1 hours 1 seconds', 'Duration literal for 3601 is "1 hours 1 seconds"');
	assert.equal(Date.getDurationLiteral(86400), '1 days', 'Duration literal for 86400 is "1 days"');
	assert.equal(Date.getDurationLiteral(86401), '1 days 1 seconds', 'Duration literal for 86401 is "1 days 1 seconds"');
})();

//age literal
(function() {
	assert.equal(new Date().getAgeLiteral(), 'just now', 'Literal age of now is "just now"');
	assert.equal(new Date().addSeconds(-1).getAgeLiteral(), 'a second ago', 'Literal age of 1 second old date is "one second ago"');
	assert.equal(new Date().addSeconds(-12).getAgeLiteral(), '12 seconds ago', 'Literal age of 12 seconds old date is "12 seconds ago"');
	assert.equal(new Date().addSeconds(-59).getAgeLiteral(), '59 seconds ago', 'Literal age of 59 seconds old date is "59 seconds ago"');
	assert.equal(new Date().addSeconds(-60).getAgeLiteral(), 'a minute ago', 'Literal age of 60 seconds old date is "a minute ago"');
	assert.equal(new Date().addSeconds(-61).getAgeLiteral(), 'a minute ago', 'Literal age of 61 seconds old date is "a minute ago"');
	assert.equal(new Date().addSeconds(-89).getAgeLiteral(), 'a minute ago', 'Literal age of 89 seconds old date is "a minute ago"');
	assert.equal(new Date().addSeconds(-90).getAgeLiteral(), '2 minutes ago', 'Literal age of 90 seconds old date is "2 minutes ago"');
	assert.equal(new Date().addSeconds(-91).getAgeLiteral(), '2 minutes ago', 'Literal age of 91 seconds old date is "2 minutes ago"');
	assert.equal(new Date().addSeconds(-4254).getAgeLiteral(), 'an hour ago', 'Literal age of 4254 seconds old date is "an hour ago"');
	assert.equal(new Date().addHours(-23).getAgeLiteral(), '23 hours ago', 'Literal age of 23 hours old date is "23 hours ago"');
	assert.equal(new Date().addHours(-24).getAgeLiteral(), 'a day ago', 'Literal age of 24 hours old date is "a day ago"');
	assert.equal(new Date().addDays(-1).getAgeLiteral(), 'a day ago', 'Literal age of 24 hours old date is "a day ago"');
	assert.equal(new Date().addDays(-42).getAgeLiteral(), '42 days ago', 'Literal age of 42 days old date is "42 days ago"');

	assert.equal(new Date().addSeconds(10).getAgeLiteral(), 'in 10 seconds', 'Literal age of 10 seconds in the future date is "in 10 seconds"');
})();

assert.end();
