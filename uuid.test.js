'use strict';

import {UUID} from './uuid.js';

assert.begin();

assert.equal(UUID.Generate().length, 36, 'An UUID contains 36 characters');
assert.equal(UUID.Generate().split('-').length, 5, 'An UUID contains 5 segments separated by "-"');
assert.equal(UUID.Generate().split('-')[0].length, 8, 'Segment 1 of an UUID contains 8 characters');
assert.equal(UUID.Generate().split('-')[1].length, 4, 'Segment 2 of an UUID contains 4 characters');
assert.equal(UUID.Generate().split('-')[2].length, 4, 'Segment 3 of an UUID contains 4 characters');
assert.equal(UUID.Generate().split('-')[3].length, 4, 'Segment 4 of an UUID contains 4 characters');
assert.equal(UUID.Generate().split('-')[4].length, 12, 'Segment 5 of an UUID contains 12 characters');

const uuid_regexp = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/;
let good_format = true;
for(let i = 0; i < 100; i++) {
	if(!uuid_regexp.test(UUID.Generate())) {
		good_format = false;
		break;
	}
}
assert.ok(good_format, '100 generated UUIDs have the good format');

assert.notEqual(UUID.Generate(), UUID.Generate(), '2 generated UUIDs are different');
const uuids = [];
let uniqueness = true;
for(let i = 0; i < 100; i++) {
	const uuid = UUID.Generate();
	if(uuids.indexOf(uuid) !== -1) {
		uniqueness = false;
		break;
	}
	uuids.push(uuid);
}
assert.ok(uniqueness, '100 generated UUIDs are different');

assert.end();