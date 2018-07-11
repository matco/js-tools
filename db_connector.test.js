'use strict';

import {DBConnector} from './db_connector.js';

const character_1 = {
	firstname : 'Anakin',
	lastname : 'Skywalker'
};
const character_2 = {
	id : 2,
	firstname : 'Luke',
	lastname : 'Skywalker'
};
const character_3 = {
	id : 3,
	firstname : 'Leia',
	lastname : ' Organa'
};
const character_4 = {
	id : 4,
	firstname : 'Han',
	lastname : 'Solo'
};

//genereate random database name because browsers don't manage to create and delete the same database multiple times
const db_name = 'characters_' + Math.floor(Math.random() * 10000);

function test_open_database() {
	const db = new DBConnector(db_name, 'id');
	db.open(function(indexed_db) {
		assert.success('Database opened successfully');
		assert.equal(indexed_db.name, db_name, 'Database name is good');
		db.drop(test_addition);
	});
}

function test_addition() {
	const db = new DBConnector(db_name, 'id');
	db.open(function() {
		//add character without id
		assert.doesThrow(
			function() {
				//this addition is synchronous as it will crash
				db.add(character_1);
			},
			function() {
				return this.name === 'DataError';
			},
			'It is not possible to add an object without id'
		);
		//set id to first character and add it
		character_1.id = 1;
		db.add(character_1, function() {
			assert.success('Object added successfully in database');
			//retrieve first character
			db.get(1, function(c_1) {
				assert.equal(c_1.id, 1, 'Retrieve object with id gives good object');
				assert.similar(c_1, character_1, 'Retrieve object with id gives same object');
				//re-add character
				db.add(character_1, function() {
					assert.success('Add same object with same id in database results in success');
					//modify second character and add it in database
					const other_character_1 = Object.clone(character_1);
					other_character_1.firstname = 'Darth';
					other_character_1.lastname = 'Vader';
					db.add(other_character_1, function() {
						assert.success('Add different object with same id in database results in success');
						//retrieve second character
						db.get(1, function(c_1) {
							assert.equal(c_1.id, 1, 'Retrieve object with id gives good object');
							assert.equal(c_1.firstname, 'Darth', 'Retrieve object with id gives good object');
							assert.equal(c_1.lastname, 'Vader', 'Retrieve object with id gives good object');
							assert.similar(c_1, other_character_1, 'Retrieve object with id gives same object');
							db.drop(test_addition_multiple);
						});
					});
				});
			});
		});
	});
}

function test_addition_multiple() {
	const db = new DBConnector(db_name, 'id');
	db.open(function() {
		//add characters in database
		db.addAll([character_1, character_2], function() {
			assert.success('Two objects added successfully in database');
			//retrieve second character
			db.get(2, function(c_2) {
				assert.equal(c_2.id, 2, 'Retrieve object with id gives good object');
				assert.equal(c_2.firstname, 'Luke', 'Retrieve object with id gives good object');
				assert.equal(c_2.lastname, 'Skywalker', 'Retrieve object with id gives good object');
				assert.similar(c_2, character_2, 'Retrieve object with id gives same object');
				//retrieve all character and count them
				db.getAll(function(characters) {
					assert.equal(characters.length, 2, 'There are 2 objects in database');
					assert.equal(characters[0].id, 1, 'Retrieve all objects return good objects');
					assert.equal(characters[1].id, 2, 'Retrieve all objects return good objects');
					db.drop(test_retrieval_and_deletion);
				});
			});
		});
	});
}

function test_retrieval_and_deletion() {
	const db = new DBConnector(db_name, 'id');
	db.open(function() {
		//add some characters
		db.addAll([character_1, character_2, character_3, character_4], function() {
			//retrieve all characters
			db.getAll(function(characters) {
				assert.equal(characters.length, 4, 'There are 4 objects in database');
				//retrieve some character
				db.getSome(
					function(character) {
						return character.lastname === 'Skywalker';
					},
					function(characters) {
						assert.equal(characters.length, 2, 'There is 2 objects in database matching a specfic filter');
						//delete some characters (all Skywalker)
						db.removeSome(
							function(character) {
								return character.lastname === 'Skywalker';
							},
							function() {
								//retrieve some character
								db.getAll(function(characters) {
									assert.equal(characters.length, 2, 'There are 2 objects in database');
									//delete one specific character (Leia)
									db.remove(3, function() {
										assert.success('Object has been deleted successfully');
										//try to retrieve a deleted character
										db.get(3, function(c) {
											assert.undefined(c, 'A deleted object should not be retrieved');
											//retrieve all remaining character (Han)
											db.getAll(function(characters) {
												assert.equal(characters.length, 1, 'There is 1 object in database');
												assert.equal(characters[0].id, 4, 'Retrieve all objects return only one remaining object');
												assert.similar(characters[0], character_4, 'Retrieve all objects return only one remaining object');
												db.drop(function() {
													assert.end();
												});
											});
										});
									});
								});
							}
						);
					}
				);
			});
		});
	});
}

assert.begin();
test_open_database();
