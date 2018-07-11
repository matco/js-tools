'use strict';

import {Bus, BusEvent} from './bus.js';

assert.begin();

const bus = new Bus();

let beeps_number = 0;
const beeps_type_numbers = {
	'short' : 0,
	'long' : 0
};
const beeps_sequence = [];

const beep_counter = {
	onBeep : function(event) {
		beeps_type_numbers[event.type]++;
		beeps_number++;
	}
};

const beep_recorder = {
	onBeepShort : function(event) {
		beeps_sequence.push({type : 'short', 'volume' : event.volume});
	},
	onBeepLong : function(event) {
		beeps_sequence.push({type : 'long', 'volume' : event.volume});
	}
};

//create node
function BusEventBeep(type, volume) {
	this.type = type;
	this.volume = volume;
}
BusEventBeep.prototype = new BusEvent();
BusEventBeep.prototype.constructor = BusEventBeep;
BusEventBeep.prototype.getCallbacks = function() {
	return ['onBeep' + this.type.capitalize(), 'onBeep'];
};

bus.register(beep_counter);
assert.equal(bus.listeners.length, 1, 'There is 1 listener in bus after 1 listener has been registered');
assert.ok(bus.isRegistered(beep_counter), 'Listener is registered after it has been registered');

bus.lock();
bus.register(beep_recorder);
assert.equal(bus.listeners.length, 1, 'There is still 1 listener in bus after 1 listener has been registered when bus is locked');
assert.notOk(bus.isRegistered(beep_recorder), 'Listener is not registered after it has been registered when bus is locked');

bus.unlock();
bus.register(beep_recorder);
assert.equal(bus.listeners.length, 2, 'There is 2 listeners in bus after 1 new listener has been registered and bus has been unlocked');
assert.ok(bus.isRegistered(beep_recorder), 'Listener is registered after it has been registered');

bus.lock();
bus.unregister(beep_recorder);
assert.equal(bus.listeners.length, 2, 'There is still 2 listener in bus after 1 listener has been unregistered when bus is locked');
assert.ok(bus.isRegistered(beep_recorder), 'Listener is still registered after it has been unregistered when bus is locked');

bus.unlock();
bus.unregister(beep_recorder);
assert.equal(bus.listeners.length, 1, 'There is 1 listener in bus after 1 listener has been unregistered');
assert.notOk(bus.isRegistered(beep_recorder), 'Listener is no more registered after it has been unregistered');

bus.reset();
assert.ok(bus.listeners.isEmpty(), 'Bus has no more listener after being reset');
assert.notOk(bus.isRegistered(beep_counter), 'Listener is not registered after bus has been reset');
assert.notOk(bus.isRegistered(beep_recorder), 'Listener is not registered after bus has been reset');

bus.register(beep_counter);
bus.register(beep_recorder);

const short_loud_beep = new BusEventBeep('short', 10);
//var long_loud_beep = new BusEventBeep('long', 10);
//var short_quiet_beep = new BusEventBeep('short', 1);
const long_quiet_beep = new BusEventBeep('long', 1);

bus.dispatch(short_loud_beep);
assert.equal(beeps_number, 1, 'There was 1 beep');
assert.equal(beeps_type_numbers['short'], 1, 'There was 1 short beep');
assert.equal(beeps_type_numbers['long'], 0, 'There was 0 long beep');
assert.equal(beeps_sequence.length, 1, 'There was 1 beep in beeps sequence');

bus.dispatch(long_quiet_beep);
assert.equal(beeps_number, 2, 'There was 2 beeps');
assert.equal(beeps_type_numbers['short'], 1, 'There was 1 short beep');
assert.equal(beeps_type_numbers['long'], 1, 'There was 1 long beep');
assert.equal(beeps_sequence.length, 2, 'There was 2 beeps in beeps sequence');

bus.disable();

bus.dispatch(short_loud_beep);
bus.dispatch(long_quiet_beep);
assert.equal(beeps_number, 2, 'There was 2 beeps');
assert.equal(beeps_type_numbers['short'], 1, 'There was 1 short beep');
assert.equal(beeps_type_numbers['long'], 1, 'There was 1 long beep');
assert.equal(beeps_sequence.length, 2, 'There was 2 beeps in beeps sequence');

bus.enable();

bus.dispatch(short_loud_beep);
bus.dispatch(long_quiet_beep);
assert.equal(beeps_number, 4, 'There was 4 beeps');
assert.equal(beeps_type_numbers['short'], 2, 'There was 2 short beeps');
assert.equal(beeps_type_numbers['long'], 2, 'There was 2 long beeps');
assert.equal(beeps_sequence.length, 4, 'There was 4 beeps in beeps sequence');

bus.pause();

bus.dispatch(short_loud_beep);
bus.dispatch(long_quiet_beep);
assert.equal(beeps_number, 4, 'There was 4 beeps');
assert.equal(beeps_type_numbers['short'], 2, 'There was 2 short beeps');
assert.equal(beeps_type_numbers['long'], 2, 'There was 2 long beeps');
assert.equal(beeps_sequence.length, 4, 'There was 4 beeps in beeps sequence');

bus.resume();

assert.equal(beeps_number, 6, 'There was 6 beeps');
assert.equal(beeps_type_numbers['short'], 3, 'There was 3 short beeps');
assert.equal(beeps_type_numbers['long'], 3, 'There was 3 long beeps');
assert.equal(beeps_sequence.length, 6, 'There was 6 beeps in beeps sequence');

bus.reset();
assert.ok(bus.listeners.isEmpty(), 'Bus has no more listener after being reset');
assert.notOk(bus.isRegistered(beep_counter), 'Listener is not registered after bus has been reset');
assert.notOk(bus.isRegistered(beep_recorder), 'Listener is not registered after bus has been reset');

assert.end();
