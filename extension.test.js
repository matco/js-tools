'use strict';

assert.begin();

//object
//isObject
(function() {
	var object = {toto : 'tutu'};
	var func = function() {'nothing to do';};
	var not_func = 'nothing';

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

	var object = {};
	assert.ok(Object.isEmpty(object), 'Variable containing {} is an empty object');

	var constructor = function() {};
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
		'Object containg string and array is equal to an other object containing an equal string and an equal array');

	var value = [1,2,'tutu'];
	assert.ok(Object.equals({property : value}, {property : value}), 'Object containg an array is equal to an other object containing the same array');
})();

//clone
(function() {
	var object = {property : 'value'};
	var cloned_object = Object.clone(object);

	assert.ok(cloned_object.hasOwnProperty('property'), 'Cloned object has the same property like the original');
	assert.equal(cloned_object.property, object.property, 'Cloned object property has the same value than the original object property');
	var constructor = function() {
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
	assert.ok(Function.isFunction(object.doNothing), 'Original object has a "doNothing" method inhereited from prototype chain');
	assert.notOk(Function.isFunction(cloned_object.doNothing), 'Cloned object does not have a "doNothing" method');
})();

//values
(function() {
	assert.ok(Object.values({}).isEmpty(), 'Values of object {} is an empty array');
	assert.similar(Object.values({toto : 'toto', titi : 'tutu'}), ['toto', 'tutu'], 'Values of object "{toto : "toto", titi : "tutu"}" are ["toto", "tutu"]');

	var embedded_object = {mama : 'momo', mimi : 'mumu'};
	var object = {toto : 'toto', titi : embedded_object};
	assert.equal(Object.values(object)[0], 'toto', 'First value of object "{toto : "toto", titi : embedded_object}" is "toto"');
	assert.equal(Object.values(object)[1], embedded_object, 'Second value of object "{toto : "toto", titi : embedded_object}" is "embedded_object"');
})();

//update
(function() {
	var object = {
		property_1 : 'value_1',
		property_2 : 'value_2',
	};
	var values = {
		property_1 : 'new_value_1',
		property_3 : 'new_value_3'
	};
	Object.update(object, values);
	assert.equal(object.property_1, 'new_value_1', 'Object property 1 has been updated with the one from values');
	assert.equal(object.property_2, 'value_2', 'Object property 2 has not been updated as it does not exists in values');
	assert.equal(object.property_3, 'new_value_3', 'Object property 3 has been created and initialized with value from values');
})();

//getObjectPathValue and getLastObjectInPath
(function() {
	var family = {
		name : 'Doe'
	};
	assert.equal(Object.getObjectPathValue(family, 'name'), 'Doe', 'Get object path value on object for path "name" gives "John"');
	assert.equal(Object.getObjectPathValue(family, 'age'), undefined, 'Get object path value on object for path "age" gives undefined');
	var person = {
		name : 'John'
	};
	family.chief = person;
	assert.equal(Object.getObjectPathValue(family, 'chief'), person, 'Get object path value on object for path "chief" gives the family chief person');
	assert.equal(Object.getObjectPathValue(family, 'chief.name'), 'John', 'Get object path value on object for path "chief.name" gives "John"');

	var main_shop = {
		name : 'Migros',
		category : 'Supermarket',
		label : function() {
			return this.category + ' ' + this.name;
		}
	};
	var main_street = {
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
	var city = {
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
	assert.equal(Object.getObjectPathValue(city, 'main_street.shops'), main_street.shops, 'Get object path value on city for path "main_street.shops" gives all main stret shops');
	assert.equal(Object.getObjectPathValue(city, 'main_street.population'), 100, 'Get object path value on city for path "main_street.population" gives the population of the main street');
	assert.equal(Object.getObjectPathValue(city, 'main_street.main_shop.label'), 'Supermarket Migros', 'Get object path value on city for path "main_street.main_shop.label" gives the label od main shop of the maint street using a function');

	//TODO does not work yet
	//assert.equal(Object.getObjectPathValue(city, 'streets[0].shops[0].name'), 'Migros', 'Get object path value on object for path "streets[0].shops[0].name" gives the population of the name of the first shop inf the first street');

	assert.equal(Object.getLastObjectInPath(city, 'names.en').object, city.names, 'Get last object in path "names.en" gives the names object');
	assert.equal(Object.getLastObjectInPath(city, 'names.en').property, 'en', 'Get last object in path "names.en" gives the "en" property');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.population').object, main_street, 'Get last object in path "main_street.population" gives the main steet object');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.population').property, 'population', 'Get last object in path "main_street.population" gives the "population" property');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.shops.length').object, main_street.shops, 'Get last object in path "main_street.shops.length" gives the array of shops in the main street object');
	assert.equal(Object.getLastObjectInPath(city, 'main_street.shops.length').property, 'length', 'Get last object in path "main_street.shops.length" gives the "length" property');
})();

//function
//isFunction
(function() {
	var func = function() {'nothing to do';};
	var not_func = 'nothing';

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

//callbackize
(function() {
	var text = 'toto';
	assert.equal(String.prototype.toUpperCase.callbackize().call(null, text), 'TOTO', 'Callbackize transform method function into callable function');
	assert.equal(String.prototype.substring.callbackize(0, 2).call(null, text), 'to', 'Callbackize preserves arguments');

	var people = ["Anakin", "Luke", "Leia", "Han"];
	assert.similar(people.map(String.prototype.toUpperCase.callbackize()), ["ANAKIN", "LUKE", "LEIA", "HAN"], 'Callbackize transform method function into callable function which is handy for array functions');
	assert.similar(people.map(String.prototype.substring.callbackize(0, 2)), ["An", "Lu", "Le", "Ha"], 'Callbackize preserves arguments which is handy for array functions');
})();

//memoize
(function() {
	var calculated = false;
	var square = function(value) {
		calculated = true;
		return Math.pow(value, 2);
	};
	assert.equal(square(2), 4, '2 square is 4');
	assert.ok(calculated, '2 square has been calculated');

	assert.doesThrow(
		function() {
			square.unmemoize();
		},
		function() {
			return this.message === 'Unable to unmemoize a function that has not been memoized'
		},
		'It is not possible to unmemoize a function which has not been previously memoized'
	);

	square = square.memoize();
	calculated = false;
	square(2);
	assert.ok(calculated, 'On first call, 2 square has been calculated');
	calculated = false;
	square(3);
	assert.ok(calculated, 'On first call, 3 square has been calculated');
	calculated = false;
	square(3);
	assert.notOk(calculated, 'On second call, 3 square has not been calculated');
	square(3);
	assert.notOk(calculated, 'On third call, 3 square has not been calculated');
	square = square.unmemoize();
	square(2);
	assert.ok(calculated, 'Memoization has been disabled, 2 square has been calculated');
	calculated = false;
	square(3);
	assert.ok(calculated, 'Memoization has been disabled, 3 square has been calculated');
})();

//string
//pad
(function() {
	assert.equal('toto'.rightPad(3, '='), 'toto', 'Pad "toto" to 3 with "=" gives "toto"');
	assert.equal('toto'.rightPad(6, '='), 'toto==', 'Pad "toto" to 6 with "=" gives "toto=="');
	assert.equal('toto'.rightPad(6, 'to'), 'tototo', 'Pad "toto" to 6 with "to" gives "tototo"');
	assert.equal('toto'.rightPad(7, 'tu'), 'tototutu', 'Pad "toto" to 7 with "to" gives "tototutu"');
	assert.equal('toto'.rightPad(-5, '='), 'toto', 'Pad "toto" to -5 with "=" gives "toto"');
	assert.equal(''.rightPad(3, '='), '===', 'Pad empty string to 3 with "=" gives "==="');
	assert.equal(''.rightPad(5, ' '), '     ', 'Pad empty string to 5 with space gives 5 spaces');
	var string = 'tutu';
	var string_padded = string.rightPad(5, '%');
	assert.equal(string, 'tutu', 'Pad creates a new string');
	assert.notEqual(string, string_padded, 'Pad creates a new string');

	assert.equal('toto'.leftPad(3, '='), 'toto', 'Pad "toto" to 3 with "=" gives "toto"');
	assert.equal('toto'.leftPad(6, '='), '==toto', 'Pad "toto" to 6 with "=" gives "==toto"');
	assert.equal('toto'.leftPad(6, 'to'), 'tototo', 'Pad "toto" to 6 with "to" gives "tototo"');
	assert.equal('toto'.leftPad(7, 'tu'), 'tututoto', 'Pad "toto" to 7 with "to" gives "tututoto"');
})();

//capitalize
(function() {
	assert.equal('rodanotech'.capitalize(), 'Rodanotech', 'Capitalize "rodanotech" gives "Rodanotech"');
	assert.equal('RODANOTECH'.capitalize(), 'RODANOTECH', 'Capitalize "RODANOTECH" gives "RODANOTECH"');
	assert.equal('rODANOTECH'.capitalize(), 'RODANOTECH', 'Capitalize "rODANOTECH" gives "RODANOTECH"');
	assert.equal('rodanotech sarl'.capitalize(), 'Rodanotech sarl', 'Capitalize "rodanotech sarl" gives "Rodanotech sarl"');
	assert.equal('rodanotech sArL'.capitalize(), 'Rodanotech sArL', 'Capitalize "rodanotech sArL" gives "Rodanotech sArL"');
	assert.equal(''.capitalize(), '', 'Capitalize "" gives ""');
	var string = 'abçdé';
	var string_capitalized = string.capitalize();
	assert.equal(string, 'abçdé', 'Capitalize create a new string');
	assert.notEqual(string, string_capitalized, 'Capitalize create a new string');
})();

//reverse
(function() {
	assert.equal('ab', 'ba'.reverse(), 'Reverse of "ab" is "ba"');
	assert.notEqual('ab', 'baba'.reverse(), 'Reverse of "ab" is not "baba"');
	assert.equal('1true3', new String('3eurt1').reverse(), 'Reverse works with any character');
	assert.equal('-', new String('-').reverse(), 'Reverse works with any character');

	var rodano = new String('rodano');

	assert.equal('onador', rodano.reverse(), 'Reverse of "rodano" is "onador"');
	assert.equal('rodano', rodano.reverse().reverse(), '"rodano" reversed two times is "rodano"');
	assert.notEqual(rodano, rodano.reverse().reverse(), 'Reverse of reversed string is not the same string');
})();

//contains
(function() {
	var rodano = new String('rodano');

	assert.ok('rodano'.contains('od'), '"rodano" contains "od"');
	assert.ok('rodano'.contains('rodano'), '"rodano" contains "rodano"');
	assert.ok('rodano'.contains(''), '"rodano" contains ""');
	assert.ok('rodano'.contains('o'), '"rodano" contains "o"');
	assert.notOk('rodano'.contains('R'), '"rodano" does not contain "R"');
	assert.ok(rodano.contains('od'), '"rodano" contains "od"');

	assert.ok('rodano'.nocaseContains('o'), '"rodano" contains "o" without case check');
	assert.ok('rodano'.nocaseContains('R'), '"rodano" contains "R" without case check');
	assert.ok('rodano'.nocaseContains('DaNo'), '"rodano" contains "DaNo" without case check');
	assert.notOk('rodano'.nocaseContains('DaNoN'), '"rodano" does not contains "DaNoN" without case check');
	assert.ok(rodano.nocaseContains('od'), '"rodano" contains "od" without case check');
	assert.ok(rodano.nocaseContains('RO'), '"rodano" contains "RO" without case check');
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
assert.ok(Number.isNumber(2,5), '2,5 is a number');
assert.ok(Number.isNumber('012'), '"012" is a number');
assert.ok(Number.isNumber('012.0'), '"012.0" is a number');
assert.ok(Number.isNumber('2.5'), '"2.5" is a number');

assert.equal(new Number(3).pad(3), '003', 'Pad 3 for 3 is "003"');
assert.equal(new Number(42).pad(8), '00000042', 'Pad 8 for 42 is "00000042"');
assert.equal(new Number(42).pad(1), '42', 'Pad 1 for 42 is "42"');
assert.equal(new Number(42).pad(-1), '42', 'Pad -1 for 42 is "42"');

//array
//objectFilter and objectMap
(function() {
	var country_1 = {
		name : 'France',
		capital : 'Paris',
		currency : 'Euro',
		label : function() {return this.capital + ', ' + this.name}
	}
	var country_2 = {
		name : 'Germany',
		capital : 'Berlin',
		currency : 'Euro',
		label : function() {return this.capital + ', ' + this.name}
	}
	var country_3 = {
		name : 'Canada',
		capital : 'Ottawa',
		currency : 'Dollar'
	}
	var countries = [country_1, country_2, country_3];

	assert.similar(countries.map(Array.objectMap('currency')), ['Euro', 'Euro', 'Dollar'], 'Object map map object property');
	assert.similar(countries.map(Array.objectMap('')), [undefined, undefined, undefined], 'Object map map object blank property as undefined');
	assert.similar(countries.map(Array.objectMap('population')), [undefined, undefined, undefined], 'Object map map object unexisting property as undefined');
	assert.similar(
		countries.map(Array.objectMap('label')),
		['Paris, France', 'Berlin, Germany', undefined],
		'Object map works with function');

	assert.similar(
		countries.filter(Array.objectFilter({currency : 'Euro'})),
		[country_1, country_2],
		'Object filter filter object on properties');
	assert.similar(
		countries.filter(Array.objectFilter({})),
		[country_1, country_2, country_3],
		'Object filter does not filter if properties object is empty');
	assert.similar(
		countries.filter(Array.objectFilter({population : 50000})),
		[],
		'Object filter works unexisting properties');
	assert.similar(
		countries.filter(Array.objectFilter({label : 'Paris, France'})),
		[country_1],
		'Object filter works with function');

	//TODO test with undefined parameters
})();

//isEmpty
assert.ok(new Array().isEmpty(), 'A new array is empty');
assert.ok([].isEmpty(), 'Array type is empty when created');
assert.notOk(new Array(1, 2).isEmpty(), 'New array [1, 2] is not empty');
assert.notOk(['a', 'b'].isEmpty(), 'Array type initialized with values is not empty');

assert.notEqual([1,2,3], [1,2,3], 'New array [1,2,3] is not equals to an other new array [1,2,3]');

//remove
(function() {
	var array;
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

//contains
(function() {
	var array = ['toto', 'titi', 'tutu'];
	assert.ok(array.contains('titi'), 'Array ["toto","titi","tutu"] contains "titi"');
	assert.notOk(array.contains('tata'), 'Array ["toto","titi","tutu"] does not contain "tata"');

	assert.ok(array.containsAll(['titi', 'tutu']), 'Array ["toto","titi","tutu"] contains all ["titi","tutu"]');
	assert.ok(array.containsAll(['toto', 'titi', 'tutu']), 'Array ["toto","titi","tutu"] contains all ["toto","titi","tutu"]');
	assert.ok(array.containsAll([]), 'Array ["toto","titi","tutu"] contains all []');
	assert.notOk(array.containsAll(['toto', 'titi', 'tutu', 'tata']), 'Array ["toto","titi","tutu"] does not contain all ["toto","titi","tutu","tata"]');
	assert.notOk(array.containsAll(['toto', 'tata']), 'Array ["toto","titi","tutu"] does not contain all ["toto","tata"]');
	assert.notOk(array.containsAll(['tata']), 'Array ["toto","titi","tutu"] does not contain ["tata"]');
})();

//contains same
(function() {
	var people_1 = {
		firstname : 'Luke',
		lastname : 'Skywalker'
	};
	var people_2 = {
		fistname : 'Han',
		lastname : 'Solo'
	};
	var people_3 = {
		firstame : 'Leia',
		lastname : ' Organa'
	};
	var people_4 = {
		firstname : 'Luke',
		lastname : 'Skywalker'
	};
	var people_5 = {
		firstame : 'Anakin',
		lastname : 'Skywalker'
	};
	var people = [people_1, people_2, people_3];

	assert.ok(people.containsSame(people_3), '"Contains same" function works the same way than "Contains" function with an object which is equal to an object in the array');
	assert.notOk(people.containsSame(people_5), '"Contains same" function works the same way than "Contains" function with an object which is equal to an object in the array');

	assert.notEqual(people_1, people_4, 'Two objects with same properties and values are not equals with the native way');
	assert.ok(Object.equals(people_1, people_4), 'Two objects with same properties and values are equals with the special function "equals"');
	assert.notOk(people.contains(people_4), '"Contains" function does not work with similar objects');
	assert.ok(people.containsSame(people_4), '"Contains same" function works with similar objects');
	assert.ok(people.containsSame({firstname : 'Luke', lastname : 'Skywalker'}), '"Contains same" function works with similar anonymous objects');
	assert.notOk(people.containsSame({firstname : 'Anakin', lastname : 'Skywalker'}), '"Contains same" function does not work with not similar objects');
})();

//removeElement, removeElements and replace
(function() {
	var array = ['toto', 'titi', 'tutu'];
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
	var array = ['toto', 'titi', 'tutu'];
	var a, b;

	a = array.slice();
	a.insert(0, 'tata');
	assert.similar(a, ['tata', 'toto', 'titi', 'tutu'], 'Insert element at position 0 inserts the element at the begining of the array');

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

//date
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
	var date = new Date('2013/04/32');
	assert.ok(!Date.isValidDate(date) || date.getTime() === new Date('2013/05/02').getTime(), 'Date [2013/04/32] is valid date [2013/05/02] for some browsers and is invalid for others browsers');
})();

assert.equal(new Date('2009/01/25').getMonthName('en'), 'January', 'Month name for date [2009/01/25] in "en" is "January"');
assert.equal(new Date('2009/01/25').getMonthName('fr'), 'Janvier', 'Month name for date [2009/01/25] in "fr" is "Janvier"');
assert.equal(new Date('2009/01/25').getMonthName('de'), 'January', 'Month name for date [2009/01/25] in "de" is "January" because this month has not been translated in German yet');
assert.equal(new Date('2011/10/10').getDayName('en'), 'Monday', 'Day name for date [2011/10/10] is "Monday"');

(function() {
	assert.equal(new Date('2009/01/25').toDisplay(), '25.01.2009', 'Date [2009/01/25] to display is "25.01.2009"');
	assert.equal(new Date('2009/01/25').toFullDisplay(), '25.01.2009 00:00:00', 'Date [2009/01/25] to full display is "25.01.2009 00:00:00"');
	assert.equal(new Date(2009, 0, 25, 22, 38, 46, 234).toFullDisplay(), '25.01.2009 22:38:46', 'Date [2009, 1, 25, 22, 38, 46, 1234] to full display is "25.01.2009 22:38:46"');
	assert.equal(new Date(2009, 11, 25, 22, 44).toFullDisplay(), '25.12.2009 22:44:00', 'Date [2009, 11, 25, 22, 44] to full display is "25.12.2009 22:38:00"');
	assert.equal(new Date('2009/01/25').format('${day}.${month}.${year}'), '25.01.2009', 'Date [2009/01/25] formatter with formatter "${day}.${month}.${year}" is "25.01.2009"');
	assert.equal(
		new Date('2009/01/25').format('${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}'),
		'25.01.2009 00:00:00:000',
		'Date [2009/01/25] formatted with formatter "${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}" is "25.01.2009 00:00:00:000"');
	assert.equal(
		new Date('December 17, 2009 03:24:12').format('${day}.${month}.${year} ${hour}:${minute}:${second}'),
		'17.12.2009 03:24:12',
		'Date parsed from string "December 17, 2009 03:24:12" formatted with formatter "${day}.${month}.${year} ${hour}:${minute}:${second}" is "17.12.2009 03:24:12"');
	assert.equal(
		new Date(2042, 5, 1, 22, 20, 52, 420).format('${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}'),
		'01.06.2042 22:20:52:420',
		'Date created with parameters [2042, 5, 1, 22, 20, 52, 420] formatted with formatter "${day}.${month}.${year} ${hour}:${minute}:${second}:${millisecond}" is "01.06.2042 22:20:52:420"');
	assert.equal(
		new Date('2009/01/25').format('Date : ${month}.${day} (month, day)'),
		'Date : 01.25 (month, day)',
		'Date [2009/01/25] formatter with formatter "Date : ${month}.${day} (month, day)" is "Date : 01.25 (month, day)"');
	assert.equal(
		new Date('December 17, 2009 19:24:12').format('${hour}$${minute}seconds${second} // Day ${day} of month ${month} in year ${year}'),
		'19$24seconds12 // Day 17 of month 12 in year 2009',
		'Date parsed from string "December 17, 2009 19:24:12" formatted with formatter "${hour}$${minute}seconds${second} // Day ${day} of month ${month} in year ${year}" is "19$$24seconds12 // Day 17 of month 12 in year 2009"');
	assert.equal(
		Date.parseToDisplay('25.01.2009').getTime(),
		new Date('2009/01/25').getTime(),
		'Parsing date "25.01.2009" gives the good date');
	var date = Date.parseToDisplay('33.01.2009');
	assert.ok(
		!Date.isValidDate(date) || date.getTime() === new Date('2009/02/02').getTime(),
		'Parsing date "33.01.2009" gives date [2009/02/02] for some browsers and gives an invalid date for others browsers');
	assert.equal(
		Date.parseToFullDisplay('25.01.2009 22:38:46').getTime(),
		new Date(2009, 0, 25, 22, 38, 46).getTime(),
		'Parsing date "25.01.2009 22:38:46" gives the good date');
	assert.equal(
		Date.parseToFullDisplay('25.01.2009 22:62:46').getTime(),
		new Date(2009, 0, 25, 23, 2, 46).getTime(),
		'Parsing date "25.01.2009 22:62:46" gives the good date');
})();

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

(function() {
	var date = new Date();
	var time = date.getTime();
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

	assert.doesThrow(
		function() {
			new Date().addSeconds(10).getAgeLiteral();
		},
		function() {
			return this.message === 'Future date not supported'
		},
		'Calling age literal on a date in the future throws an exception with message : "Future date not supported"'
	);
})();

assert.end();
