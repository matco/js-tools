'use strict';

var TestEntities = {
	City : function() {
		this.names = {};
		this.population = 10;
		this.streets = [];

		this.getLongStreets = function() {
			var streets = [];
			for(var i = 0; i < this.streets.length; i++) {
				var street = this.streets[i];
				if(street.length > 1250) {
					streets.push(street);
				}
			}
			return streets;
		};

		this.getStreetFromName = function(name) {
			for(var i = 0; i < this.streets.length; i++) {
				if(this.streets[i].name === name) {
					return this.streets[i];
				}
			}
			throw 'Unable to find street with name [' + name + ']';
		};
	},

	Street : function() {
		this.city = Reviver.BACK_REFERENCE;
		this.name;
		this.length;
		this.shops = [];

		this.getHasMigros = function() {
			for(var i = this.shops.length - 1; i >= 0; i--) {
				if(this.shops[i].name === 'Migros') {
					return true;
				}
			}
			return false;
		};
	},

	Shop : function() {
		this.street = Reviver.BACK_REFERENCE;
		this.name;
		this.number;
		this.category;

		this.getLabel = function() {
			return this.category + ' ' + this.name;
		};

		this.getAddress = function(language) {
			return this.name + ' - ' + this.street.name + ', ' + this.number + ' - ' + this.street.city.names[language];
		};
	}
};

function getConstructorForEntity(entity) {
	switch(entity) {
		case 'City' : return TestEntities.City;
		case 'Street' : return TestEntities.Street;
		case 'Shop' : return TestEntities.Shop;
	}
}

function getPropertiesForEntity(entity) {
	switch(entity) {
		case 'City' : return ['names', 'population', 'streets'];
		case 'Street' : return ['city', 'name', 'length', 'shops'];
		case 'Shop' : return ['street', 'name', 'number', 'category'];
	}
}

var city = {
	"names" : {
		"en" : "Geneva",
		"fr" : "Genève",
		"de" : "Genf"
	},
	"population" : 500000,
	"entity" : "City",
	"streets" : [
		{
			"name" : "Avenue de Champel",
			"entity" : "Street",
			"length" : 1500,
			"population" : 100, //undecladred property
			"shops" : [
				{
					"name" : "Migros",
					"number" : 81,
					"entity" : "Shop",
					"category" : "Supermarket"
				},
				{
					"name" : "Pompei",
					"number" : 75,
					"entity" : "Shop",
					"category" : "Restaurant"
				}
			]
		},
		{
			"name" : "Rue de Lausanne",
			"entity" : "Street",
			"length" : 1000
		}
	]
};

var streets = [
	{
		"name" : "Avenue de Champel",
		"entity" : "Street",
		"length" : 1500,
		"population" : 100, //undecladred property
		"shops" : [
			{
				"name" : "Migros",
				"number" : 81,
				"entity" : "Shop",
				"category" : "Supermarket"
			},
			{
				"name" : "Pompei",
				"number" : 75,
				"entity" : "Shop",
				"category" : "Restaurant"
			}
		]
	},
	{
		"name" : "Rue de Lausanne",
		"entity" : "Street",
		"length" : 1000
	}
];

var shops = {
	Restaurant : {
		"name" : "Pompei",
		"number" : 75,
		"entity" : "Shop",
		"category" : "Restaurant"
	},
	Supermarket : {
		"name" : "Migros",
		"number" : 81,
		"entity" : "Shop",
		"category" : "Supermarket"
	}
};



try {
	assert.begin();

	var reviver;

	//non strict mode, properties are not checked
	reviver = new Reviver({
		entityProperty : 'entity',
		entitiesConstructors : getConstructorForEntity,
		preserveEntityProperty : true
	});
	var revived_city_1 = reviver.revive(city);
	assert.equal(revived_city_1.constructor, TestEntities.City, 'Constructor is the good class');
	assert.equal(revived_city_1.names['en'], 'Geneva', 'Simple objects properties are not modified: city name in "en" is "Geneva"');
	assert.equal(revived_city_1.population, 500000, 'Properties are not modified: population is 500000');
	assert.equal(revived_city_1.streets[0].entity, 'Street', 'Entity property for first street is "Street" because preserveEntityProperty has been set to true');
	assert.equal(revived_city_1.streets.length, 2, 'Arrays are not modified: there is 2 streets');
	assert.equal(revived_city_1.getLongStreets().length, 1, 'Object has been revived and methods are available: there is 1 long street');
	assert.equal(revived_city_1.streets[0].name, 'Avenue de Champel', 'Arrays and properties are not modified: first street name is "Avenue de Champel"');
	assert.equal(revived_city_1.streets[0].population, 100, 'In non strict mode, even properties which have not been decladred are copied: population for first street is 100');
	assert.equal(revived_city_1.streets[0].city.names['fr'], 'Genève', 'Back referenced are managed: city name in "fr" for the first street is "Genève"');
	assert.equal(revived_city_1.getStreetFromName('Avenue de Champel').shops[0].name, 'Migros', 'Methods are available and return revived objects: first shop in street "Avenue de Champel" is "Migros"');
	assert.equal(revived_city_1.getStreetFromName('Avenue de Champel').shops[0].getAddress('de'), 'Migros - Avenue de Champel, 81 - Genf', 'Methods are available on revived objects: address in "de" for first shop in "Avenue de Champel" is "Migros - Avenue de Champel, 81 - Genf"');

	//strict mode, properties are checked and only declared properties are imported
	reviver = new Reviver({
		entityProperty : 'entity',
		entitiesConstructors : getConstructorForEntity,
		entitiesProperties : getPropertiesForEntity,
		preserveEntityProperty : true,
		debug : false
	});
	var revived_city_2 = reviver.revive(city);
	assert.equal(revived_city_2.names['en'], 'Geneva', 'Simple objects properties are not modified: city name in "en" is "Geneva"');
	assert.equal(revived_city_2.streets.entity, undefined, 'Entity property is undefined even if preserveEntityProperty has been set to true because entity property is not returned by entitiesProperties function');
	assert.equal(revived_city_2.population, 500000, 'Properties are not modified: population is 500000');
	assert.equal(revived_city_2.getLongStreets().length, 1, 'Object has been revived and methods are available: there is 1 long street');
	assert.equal(revived_city_2.streets[0].population, undefined, 'In strict mode, properties which have not been declared are not copied: population for first street is undefined');

	//array
	var revived_streets = reviver.revive(streets);
	assert.equal(revived_streets.length, 2, 'Array structure is preserved: there is two streets');
	assert.equal(revived_streets[0].constructor, TestEntities.Street, 'Constructor is the good class');
	assert.ok(revived_streets[0].getHasMigros(), 'Methods are available: first street contains a Migros');
	assert.notOk(revived_streets[1].getHasMigros(), 'Methods are available: second street contains a Migros');

	//map
	var revived_shops = reviver.revive(shops);
	assert.ok('Restaurant' in revived_shops, 'Map structure is preserved');
	assert.ok('Supermarket' in revived_shops, 'Map structure is preserved');
	assert.equal(revived_shops['Restaurant'].constructor, TestEntities.Shop, 'Constructor is the good class');
	assert.doesThrow(
		function() {
			revived_shops['Supermarket'].getAddress('en');
		},
		undefined,
		'Revived objects are self-contained'
	);
	assert.equal(revived_shops['Supermarket'].getLabel(), 'Supermarket Migros', 'Methods are available on revived objects: supermarket label is "Supermarket Migros"');
	assert.equal(revived_shops.Restaurant.getLabel(), 'Restaurant Pompei', 'Methods are available on revived objects: restaurant label is "Restaurant Pompei"');

	assert.end();
}
catch(exception) {
	assert.fail('Unexpected error with reviver ' + exception.message);
}