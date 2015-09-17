'use strict';

assert.begin();

var people_1 = {
	firstname : 'Luke',
	lastname : 'Skywalker'
};
var people_2 = {
	id : 2,
	firstname : 'Han',
	lastname : 'Solo'
};
var people_3 = {
	id : 3,
	firstame : 'Anakin',
	lastname : 'Skywalker'
};
var people_4 = {
	id : 4,
	firstame : 'Leia',
	lastname : ' Organa'
};

var db = new DBConnector('people', 'id');
db.open(function(indexed_db) {
	assert.success('Database opened successfully');
	assert.equal(indexed_db.name, 'people', 'Database id is "people"');
	//add people without id
	assert.doesThrow(
		function() {
			//this addition is synchronous as it will crash
			db.add(people_1);
		},
		function() {
			return this.name === 'DataError';
		},
		'It is not possible to add an object without id'
	);
	//set id to first people and add it
	people_1.id = 1;
	db.add(people_1, function() {
		assert.success('Object added successfully in database');
		//retrieve first people
		db.get(1, function(p_1) {
			assert.equal(p_1.id, 1, 'Retrieve object with id gives good object');
			assert.similar(p_1, people_1, 'Retrieve object with id gives same object');
			//add second people in database
			db.add(people_2, function() {
				assert.success('Second object added successfully in database');
				//retrieve second people
				db.get(2, function(p_2) {
					assert.equal(p_2.id, 2, 'Retrieve object with id gives good object');
					assert.equal(p_2.firstname, 'Han', 'Retrieve object with id gives good object');
					assert.equal(p_2.lastname, 'Solo', 'Retrieve object with id gives good object');
					assert.similar(p_2, people_2, 'Retrieve object with id gives same object');
					//retrieve all people and count them
					db.getAll(
						function(p) {
							var valid = p.id === 1 || p.id === 2;
							assert.ok(valid, 'Retrieve all objects return good objects');
						},
						function(people) {
							assert.equal(people.length, 2, 'There is 2 objects in database');
							//re-add second people
							db.add(people_2, function() {
								assert.success('Add same object with same id in database results in success');
								//modify second people and add it in database
								people_2.firstname = 'Boba';
								people_2.lastname = 'Fett';
								db.add(people_2, function() {
									assert.success('Add different object with same id in database results in success');
									//retrieve second people
									db.get(2, function(p_2) {
										assert.equal(p_2.id, 2, 'Retrieve object with id gives good object');
										assert.equal(p_2.firstname, 'Boba', 'Retrieve object with id gives good object');
										assert.equal(p_2.lastname, 'Fett', 'Retrieve object with id gives good object');
										assert.similar(p_2, people_2, 'Retrieve object with id gives same object');
										//retrieve all people and count them
										db.getAll(
											function(p) {
												var valid = p.id === 1 || p.id === 2;
												assert.ok(valid, 'Retrieve all objects return good objects');
												valid = p.firstname === 'Luke' || p.firstname === 'Boba';
												assert.ok(valid, 'Retrieve all objects return good objects');
											},
											function(people) {
												assert.equal(people.length, 2, 'There is 2 objects in database');
												//add third and fourth people
												db.addAll([people_3, people_4], function() {
													//retrieve all people
													db.getAll(undefined, function(people) {
														assert.equal(people.length, 4, 'There is 4 objects in database');
														//retrieve some people
														db.getSome(
															function(people) {
																return people.lastname === 'Skywalker';
															},
															function(people) {
																assert.equal(people.length, 2, 'There is 2 objects in database matching a specfic filter');
																//delete some people
																db.removeSome(
																	function(p) {
																		return p.lastname === 'Skywalker';
																	},
																	function() {
																		//retrieve some people
																		db.getAll(undefined, function(people) {
																			assert.equal(people.length, 2, 'There is 2 objects in database');
																			//delete one specific people
																			db.remove(2, function() {
																				assert.success('Object has been deleted successfully');
																				//try to retrieve a deleted people
																				db.get(2, function(p) {
																					assert.undefined(p, 'A deleted object should not be retrieved');
																					//retrieve all people
																					db.getAll(
																						function(p) {
																							assert.equal(p.id, 4, 'Retrieve all objects return only one remaining object');
																						},
																						function(people) {
																							assert.equal(people.length, 1, 'There is 1 object in database');
																							db.drop();
																							assert.end();
																						}
																					);
																				});
																			});
																		});
																	}
																);
															}
														);
													});
												});
											}
										);
									});
								});
							});
						}
					);
				});
			});
		});
	});
});
