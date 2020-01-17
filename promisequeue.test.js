import {PromiseQueue} from './promisequeue.js';

export default function test(assert) {
	assert.begin();

	const messages = [];
	let chrono = 0;
	const delay = 200;

	function timer_generator(message, time) {
		return () => new Promise(function(resolve) {
			messages.push(message);
			chrono += time;
			console.log(message);
			setTimeout(resolve, time);
		});
	}

	const queue = new PromiseQueue().then(() => assert.end());

	queue.add(timer_generator('Message 1 (1d)', delay));

	queue.addAll([
		timer_generator('Message 2 (2d)', delay),
		timer_generator('Message 3 (3d)', delay)
	]);

	queue.addAll([
		timer_generator('Message 4 (4d)', delay / 2),
		timer_generator('Message 5 (4.5d)', delay / 2)
	]);

	queue.add(() => new Promise(function(resolve) {
		assert.equal(messages.length, 5, 'Messages list contains 5 messages');
		assert.equal(messages[0], 'Message 1 (1d)', 'First message is good message');
		assert.equal(messages[1], 'Message 2 (2d)', 'Second message is good message');
		assert.equal(messages[2], 'Message 3 (3d)', 'Third message is good message');
		assert.equal(messages[3], 'Message 4 (4d)', 'Fourth message is good message');
		assert.equal(messages[4], 'Message 5 (4.5d)', 'Fifth message is good message');
		assert.equal(chrono, 4 * delay, 'Tests are done 4d later');
		setTimeout(resolve, 2 * delay);
	}));

	queue.addAll([
		timer_generator('Message 6 (7d)', delay),
		timer_generator('Message 7 (8d)', delay)
	]);

	//following lines should be useless
	queue.run();
	queue.run();
	queue.run();
}
