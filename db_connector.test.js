import {DBConnector} from './db_connector.js';

const character_1 = {
	firstname: 'Anakin',
	lastname: 'Skywalker'
};
const character_2 = {
	id: 2,
	firstname: 'Luke',
	lastname: 'Skywalker'
};
const character_3 = {
	id: 3,
	firstname: 'Leia',
	lastname: ' Organa'
};
const character_4 = {
	id: 4,
	firstname: 'Han',
	lastname: 'Solo'
};

//generate random database name because browsers don't manage to create and delete the same database multiple times
const db_name = 'characters_' + Math.floor(Math.random() * 10000);

export default async function test(assert) {
	assert.begin();
	//open database
	let db = new DBConnector(db_name, 'id');
	const indexed_db = await db.open();
	assert.success('Database opened successfully');
	assert.equal(indexed_db.name, db_name, 'Database name is good');
	await db.drop();

	//add in database
	db = new DBConnector(db_name, 'id');
	await db.open();
	//add character without id
	try {
		await db.add(character_1);
		assert.fail('It is possible to add an object without id');
	}
	catch(exception) {
		assert.equal(exception.name, 'DataError', 'It is not possible to add an object without id');
	}
	//set id to first character and add it
	character_1.id = 1;
	await db.add(character_1);
	assert.success('Object added successfully in database');
	//retrieve first character
	let character = await db.get(1);
	assert.equal(character.id, 1, 'Retrieve object with id gives good object');
	assert.similar(character, character_1, 'Retrieve object with id gives same object');
	//re-add character
	await db.add(character_1);
	assert.success('Add same object with same id in database results in success');
	//modify second character and add it in database
	const other_character_1 = Object.assign({}, character_1);
	other_character_1.firstname = 'Darth';
	other_character_1.lastname = 'Vader';
	await db.add(other_character_1);
	assert.success('Add different object with same id in database results in success');
	//retrieve second character
	character = await db.get(1);
	assert.equal(character.id, 1, 'Retrieve object with id gives good object');
	assert.equal(character.firstname, 'Darth', 'Retrieve object with id gives good object');
	assert.equal(character.lastname, 'Vader', 'Retrieve object with id gives good object');
	assert.similar(character, other_character_1, 'Retrieve object with id gives same object');
	await db.drop();

	//multiple add
	db = new DBConnector(db_name, 'id');
	await db.open();
	//add characters in database
	await db.addAll([character_1, character_2]);
	assert.success('Two objects added successfully in database');
	//retrieve second character
	character = await db.get(2);
	assert.equal(character.id, 2, 'Retrieve object with id gives good object');
	assert.equal(character.firstname, 'Luke', 'Retrieve object with id gives good object');
	assert.equal(character.lastname, 'Skywalker', 'Retrieve object with id gives good object');
	assert.similar(character, character_2, 'Retrieve object with id gives same object');
	//retrieve all character and count them
	let characters = await db.getAll();
	assert.equal(characters.length, 2, 'There are 2 objects in database');
	assert.equal(characters[0].id, 1, 'Retrieve all objects return good objects');
	assert.equal(characters[1].id, 2, 'Retrieve all objects return good objects');
	await db.drop();

	//retrieval and deletion
	db = new DBConnector(db_name, 'id');
	await db.open();
	//add some characters
	await db.addAll([character_1, character_2, character_3, character_4]);
	//retrieve all characters
	characters = await db.getAll();
	assert.equal(characters.length, 4, 'There are 4 objects in database');
	//retrieve some character
	characters = await db.getSome(character => character.lastname === 'Skywalker');
	assert.equal(characters.length, 2, 'There is 2 objects in database matching a specific filter');
	//delete some characters (all Skywalker)
	await db.removeSome(character => character.lastname === 'Skywalker');
	//retrieve some character
	characters = await db.getAll();
	assert.equal(characters.length, 2, 'There are 2 objects in database');
	//delete one specific character (Leia)
	await db.remove(3);
	assert.success('Object has been deleted successfully');
	//try to retrieve a deleted character
	character = await db.get(3);
	assert.undefined(character, 'A deleted object should not be retrieved');
	//retrieve all remaining character (Han)
	characters = await db.getAll();
	assert.equal(characters.length, 1, 'There is 1 object in database');
	assert.equal(characters[0].id, 4, 'Retrieve all objects return only one remaining object');
	assert.similar(characters[0], character_4, 'Retrieve all objects return only one remaining object');
	await db.drop();
	assert.end();
}
