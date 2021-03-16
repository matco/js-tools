import {Reviver} from './reviver.js';

class City {
	static getProperties() {
		return {
			names: {type: 'object'},
			population: {type: 'number'},
			streets: {type: 'array'}
		};
	}
	constructor() {
		//declaring properties here only helps type checking by a Typescript compiler
		this.names = {};
		this.population = 10;
		/**@type {Array<Street>}*/
		this.streets = [];
	}

	getLongStreets() {
		return this.streets.filter(s => s.length > 1250);
	}

	getStreetFromName(name) {
		const street = this.streets.find(s => s.name === name);
		if(street) {
			return street;
		}
		throw `Unable to find street with name [${name}]`;
	}
}

class Street {
	static getProperties() {
		return {
			city: {type: 'City', back_reference: true},
			name: {type: 'string'},
			length: {type: 'number'},
			shops: {type: 'array'}
		};
	}
	constructor() {
		//declaring properties here only helps type checking by a Typescript compiler
		/**@type {City}*/
		this.city = undefined;
		this.name = undefined;
		this.length = undefined;
		this.shops = [];
	}

	getHasMigros() {
		return this.shops.some(s => s.name === 'Migros');
	}
}

class Shop {
	static getProperties() {
		return {
			street: {type: 'Street', back_reference: true},
			name: {type: 'string'},
			number: {type: 'number'},
			category: {type: 'string'}
		};
	}
	constructor() {
		//declaring properties here only helps type checking by a Typescript compiler
		/**@type {Street}*/
		this.street = undefined;
		this.name = undefined;
		this.number = undefined;
		this.category = undefined;
	}

	getLabel() {
		return `${this.category} ${this.name}`;
	}

	getAddress(language) {
		return `${this.name} - ${this.street.name}, ${this.number} - ${this.street.city.names[language]}`;
	}
}

function buildEntity(entity) {
	const builder = getConstructorForEntity(entity);
	const instance = new builder();
	/*for(const [property, value] of Object.entries(properties)) {
		instance[property] = value;
	}*/
	return instance;
}

function getConstructorForEntity(entity) {
	switch(entity) {
		case 'City' : return City;
		case 'Street' : return Street;
		case 'Shop' : return Shop;
	}
	throw new Error(`No constructor for entity ${entity}`);
}

function getPropertiesForEntity(entity) {
	return getConstructorForEntity(entity).getProperties();
}

const city = {
	'names': {
		'en': 'Geneva',
		'fr': 'Genève',
		'de': 'Genf'
	},
	'population': 500000,
	'className': 'City',
	'streets': [
		{
			'name': 'Avenue de Champel',
			'className': 'Street',
			'length': 1500,
			'population': 100, //undeclared property
			'shops': [
				{
					'name': 'Migros',
					'number': 81,
					'className': 'Shop',
					'category': 'Supermarket'
				},
				{
					'name': 'Pompei',
					'number': 75,
					'className': 'Shop',
					'category': 'Restaurant'
				}
			]
		},
		{
			'name': 'Rue de Lausanne',
			'className': 'Street',
			'length': 1000
		}
	]
};

const streets = [
	{
		'name': 'Avenue de Champel',
		'className': 'Street',
		'length': 1500,
		'population': 100, //undeclared property
		'shops': [
			{
				'name': 'Migros',
				'number': 81,
				'className': 'Shop',
				'category': 'Supermarket'
			},
			{
				'name': 'Pompei',
				'number': 75,
				'className': 'Shop',
				'category': 'Restaurant'
			}
		]
	},
	{
		'name': 'Rue de Lausanne',
		'className': 'Street',
		'length': 1000
	}
];

const street = {
	'name': 'Avenue de Lausanne',
	'className': 'Street',
	'length': 'very long', //property that does not match its declared type
	'population': 100, //undeclared property
	'shops': []
};

const shops = {
	Restaurant: {
		'name': 'Pompei',
		'number': 75,
		'className': 'Shop',
		'category': 'Restaurant'
	},
	Supermarket: {
		'name': 'Migros',
		'number': 81,
		'className': 'Shop',
		'category': 'Supermarket'
	}
};

export default function test(assert) {
	assert.begin();

	let reviver;

	//preserve unknown properties (properties are not checked)
	reviver = new Reviver({
		entityProperty: 'className',
		entitiesConstructors: getConstructorForEntity,
		entitiesProperties: getPropertiesForEntity,
		preserveUnknownProperties: true,
		preserveEntityProperty: true
	});
	const revived_city_1 = reviver.revive(city);
	assert.equal(revived_city_1.constructor, City, 'Constructor is the good class');
	assert.equal(revived_city_1.names['en'], 'Geneva', 'Simple objects properties are not modified: city name in "en" is "Geneva"');
	assert.equal(revived_city_1.population, 500000, 'Properties are not modified: population is 500000');
	assert.equal(revived_city_1.streets[0].className, 'Street', 'Entity property for first street is "Street" because preserveEntityProperty has been set to true');
	assert.equal(revived_city_1.streets.length, 2, 'Arrays are not modified: there is 2 streets');
	assert.equal(revived_city_1.getLongStreets().length, 1, 'Object has been revived and methods are available: there is 1 long street');
	assert.equal(revived_city_1.streets[0].name, 'Avenue de Champel', 'Arrays and properties are not modified: first street name is "Avenue de Champel"');
	assert.equal(revived_city_1.streets[0].population, 100, 'If preserve unknown properties is set to true, even properties that have not been declared are copied: population for first street is 100');
	assert.equal(revived_city_1.streets[0].city.names['fr'], 'Genève', 'Back referenced are managed: city name in "fr" for the first street is "Genève"');
	assert.equal(revived_city_1.getStreetFromName('Avenue de Champel').shops[0].name, 'Migros', 'Methods are available and return revived objects: first shop in street "Avenue de Champel" is "Migros"');
	assert.equal(revived_city_1.getStreetFromName('Avenue de Champel').shops[0].getAddress('de'), 'Migros - Avenue de Champel, 81 - Genf', 'Methods are available on revived objects: address in "de" for first shop in "Avenue de Champel" is "Migros - Avenue de Champel, 81 - Genf"');

	//do not preserve unknown properties (properties are checked and only declared properties are imported)
	reviver = new Reviver({
		entityProperty: 'className',
		factory: buildEntity,
		entitiesProperties: getPropertiesForEntity,
		preserveEntityProperty: true,
		debug: false
	});
	const revived_city_2 = reviver.revive(city);
	assert.equal(revived_city_2.names['en'], 'Geneva', 'Simple objects properties are not modified: city name in "en" is "Geneva"');
	assert.equal(revived_city_2.streets.className, undefined, 'Entity property is undefined even if preserveEntityProperty has been set to true because entity property is not returned by entitiesProperties function');
	assert.equal(revived_city_2.population, 500000, 'Properties are not modified: population is 500000');
	assert.equal(revived_city_2.getLongStreets().length, 1, 'Object has been revived and methods are available: there is 1 long street');
	assert.equal(revived_city_2.streets[0].population, undefined, 'If preserve unknown properties is left default (set to false), properties that have not been declared are not copied: population for first street is undefined');

	//array
	const revived_streets = reviver.revive(streets);
	assert.equal(revived_streets.length, 2, 'Array structure is preserved: there is two streets');
	assert.equal(revived_streets[0].constructor, Street, 'Constructor is the good class');
	assert.ok(revived_streets[0].getHasMigros(), 'Methods are available: first street contains a Migros');
	assert.notOk(revived_streets[1].getHasMigros(), 'Methods are available: second street contains a Migros');

	//map
	const revived_shops = reviver.revive(shops);
	assert.ok('Restaurant' in revived_shops, 'Map structure is preserved');
	assert.ok('Supermarket' in revived_shops, 'Map structure is preserved');
	assert.equal(revived_shops['Restaurant'].constructor, Shop, 'Constructor is the good class');
	assert.doesThrow(
		() => revived_shops['Supermarket'].getAddress('en'),
		undefined,
		'Revived objects are self-contained'
	);
	assert.equal(revived_shops['Supermarket'].getLabel(), 'Supermarket Migros', 'Methods are available on revived objects: supermarket label is "Supermarket Migros"');
	assert.equal(revived_shops.Restaurant.getLabel(), 'Restaurant Pompei', 'Methods are available on revived objects: restaurant label is "Restaurant Pompei"');

	//property that does not match its declared type
	reviver = new Reviver({
		factory: buildEntity,
		entitiesProperties: getPropertiesForEntity,
	});
	const revived_street = reviver.revive(street);
	assert.equal(revived_street.length, 'very long', 'Properties that do not match their declared types are kept when types are not enforced');
	reviver = new Reviver({
		factory: buildEntity,
		entitiesProperties: getPropertiesForEntity,
		enforceTypes: true
	});
	assert.doesThrow(
		() => reviver.revive(street),
		undefined,
		'Properties that do not match their declared types are discarded when types are enforced'
	);

	assert.end();
}
