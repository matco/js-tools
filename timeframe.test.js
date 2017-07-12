'use strict';

assert.begin();

assert.doesThrow(
	function() {
		new Timeframe(new Date('2004/02/26'), new Date('2004/02/25'));
	},
	undefined,
	'It is not possible to create a timeframe with a stop date before its start date'
);

var timeframe;

//infinite
assert.notOk(new Timeframe(new Date('2004/02/26'), new Date('2004/02/27')).isInfinite(), 'Timeframe with start date and stop date is not infinite');
assert.notOk(new Timeframe(new Date('2004/02/26')).isInfinite(), 'Timeframe with only start date is not infinite');
assert.ok(new Timeframe().isInfinite(), 'Timeframe without start date nor stop date is infinite');

//staked
assert.ok(new Timeframe(new Date('2004/02/26'), new Date('2004/02/27')).isStaked(), 'Timeframe with start date and stop date is stacked');
assert.notOk(new Timeframe(new Date('2004/02/26')).isStaked(), 'Timeframe with only start date is not stacked');
assert.notOk(new Timeframe().isStaked(), 'Timeframe without start date nor stop date is not stacked');

//periods
timeframe = new Timeframe(new Date('2004/02/26'), new Date('2004/02/27'));
assert.equal(timeframe.getDays(), 1, 'There is 1 day between [2004/02/26] and [2004/02/27]');
assert.equal(timeframe.getHours(), 24, 'There are 24 hours between [2004/02/26] and [2004/02/27]');
assert.equal(timeframe.getMinutes(), 1440, 'There are 1440 minutes between [2004/02/26] and [2004/02/27]');
assert.equal(timeframe.getSeconds(), 86400, 'There are 86400 seconds between [2004/02/26] and [2004/02/27]');

timeframe = new Timeframe(new Date('2010/12/31'), new Date('2010/12/31'));
assert.equal(timeframe.getDays(), 0, 'There is 0 day between [2010/12/31] and [2010/12/31]');
assert.equal(timeframe.getHours(), 0, 'There is 0 hour between [2010/12/31] and [2010/12/31]');
assert.equal(timeframe.getMinutes(), 0, 'There is 0 minute between [2010/12/31] and [2010/12/31]');
assert.equal(timeframe.getSeconds(), 0, 'There is 0 second between [2010/12/31] and [2010/12/31]');

timeframe = new Timeframe(new Date('2004/02/26'), new Date('2004/03/01'));
assert.equal(timeframe.getDays(), 4, 'There are 4 days between [2004/02/26] and [2004/03/01]');

timeframe = new Timeframe(new Date('2016-05-01T08:12:04.999Z'), new Date('2016-05-01T08:12:08.001Z'));
assert.equal(Math.round(timeframe.getDays()), 0, 'There are 0 day between [2016-05-01T08:12:04.999Z] and [2016-05-01T08:12:08.001Z]');
assert.equal(Math.round(timeframe.getHours()), 0, 'There are 0 hour between [2016-05-01T08:12:04.999Z] and [2016-05-01T08:12:08.001Z]');
assert.equal(Math.round(timeframe.getMinutes()), 0, 'There are 0 minute between [2016-05-01T08:12:04.999Z] and [2016-05-01T08:12:08.001Z]');
assert.equal(timeframe.getSeconds(), 3.002, 'There are 3.002 seconds between [2016-05-01T08:12:04.999Z] and [2016-05-01T08:12:08.001Z]');

timeframe = new Timeframe(undefined, new Date('2016-05-01T08:12:04.999Z'));
assert.undefined(timeframe.getDays(), 'Retrieving number of days with an unstaked timeframe returns undefined');
assert.undefined(timeframe.getHours(), 'Retrieving number of hours with an unstaked timeframe returns undefined');
assert.undefined(timeframe.getMinutes(), 'Retrieving number of minutes with an unstaked timeframe returns undefined');
assert.undefined(timeframe.getSeconds(), 'Retrieving number of seconds with an unstaked timeframe returns undefined');

//infinite time frame periods
timeframe = new Timeframe(new Date('2004/02/26'));
assert.undefined(timeframe.getDays(), 'Retrieving number of days with an unstaked timeframe returns undefined');
assert.undefined(timeframe.getHours(), 'Retrieving number of hours with an unstaked timeframe returns undefined');
assert.undefined(timeframe.getMinutes(), 'Retrieving number of minutes with an unstaked timeframe returns undefined');
assert.undefined(timeframe.getSeconds(), 'Retrieving number of seconds with an unstaked timeframe returns undefined');

//shift
timeframe = new Timeframe(new Date('2010/12/27'), new Date('2010/12/31'));
assert.equal(timeframe.getDays(), 4, 'There are 4 days between [2010/12/27] and [2010/12/31]');
timeframe.shiftDays(7);
assert.equal(timeframe.getDays(), 4, 'There are still 4 days between [2010/12/27] and [2010/12/31] with a shift of 7 days');
assert.equal(timeframe.startDate.toDisplay(), '03.01.2011', 'Timeframe beginning [2010/12/27] begins [2011/01/03] with a shift of 7 days');
assert.equal(timeframe.stopDate.toDisplay(), '07.01.2011', 'Timeframe ending [2010/12/31] ends [2011/01/06] with a shift of 7 days');

//surround
timeframe = new Timeframe(new Date('2009/02/01'), new Date('2009/10/01'));
assert.ok(timeframe.surround(new Date('2009/04/01')), '2009/04/01 is between 2009/02/01 and 2009/10/01');
assert.ok(timeframe.surround(new Date('2009/10/01')), '2009/10/01 is between 2009/02/01 and 2009/10/01');
assert.notOk(timeframe.surround(new Date('2009/01/25')), '2009/01/25 is not between 2009/02/01 and 2009/10/01');

//infinite time frame surround
var timeframe = new Timeframe(new Date('2009/02/01'));
assert.ok(timeframe.surround(new Date('2009/04/01')), '2009/04/01 is between 2009/02/01 and infinite');
assert.ok(timeframe.surround(new Date('2200/08/01')), '2200/08/01 is between 2009/02/01 and infinite');
assert.notOk(timeframe.surround(new Date('2009/01/25')), '2009/01/25 is not between 2009/02/01 and infinite');

var timeframe = new Timeframe(undefined, new Date('2009/02/01'));
assert.ok(timeframe.surround(new Date('2009/01/25')), '2009/01/25 is between infinite and 2009/02/01');
assert.ok(timeframe.surround(new Date('1800/08/01')), '1800/08/01 is between infinite and 2009/02/01');
assert.notOk(timeframe.surround(new Date('2009/04/01')), '2009/04/01 is not between infinite and 2009/02/01');

//overlap
var timeframe_1 = new Timeframe(new Date('2009/02/01'), new Date('2009/10/01'));
var timeframe_2 = new Timeframe(new Date('2009/04/01'), new Date('2009/08/01'));
assert.ok(timeframe_1.overlap(timeframe_2), 'Timeframe [2009/04/01 to 2009/08/01] overlaps timeframe [2009/02/01 to 2009/10/01]');

timeframe_1 = new Timeframe(new Date('2008/02/07'), new Date('2008/09/07'));
timeframe_2 = new Timeframe(new Date('2010/01/07'), new Date('2010/02/20'));
assert.notOk(timeframe_1.overlap(timeframe_2), 'Timeframe [2008/02/07 to 2008/09/07] does not overlap timeframe [2010/01/07 to 2010/02/20]');

timeframe_1 = new Timeframe(new Date('2008/02/07'), new Date('2008/09/07'));
timeframe_2 = new Timeframe(new Date('2008/02/07'), new Date('2008/09/07'));
assert.ok(timeframe_1.overlap(timeframe_2), 'Timeframe [2008/02/07 to 2008/02/07] overlaps timeframe [2008/02/07 to 2008/02/07]');

//infinite time frame overlap
var timeframe_1 = new Timeframe(new Date('2009/02/01'));
var timeframe_2 = new Timeframe(new Date('2009/04/01'), new Date('2009/08/01'));
assert.ok(timeframe_1.overlap(timeframe_2), 'Timeframe [2009/04/01 to infinite] overlaps timeframe [2009/02/01 to 2009/10/01]');

timeframe_1 = new Timeframe(undefined, new Date('2008/09/07'));
timeframe_2 = new Timeframe(undefined, new Date('2010/02/20'));
assert.ok(timeframe_1.overlap(timeframe_2), 'Timeframe [infinite to 2008/09/07] overlaps timeframe [infinite to 2010/02/20]');

//equal
timeframe_1 = new Timeframe(new Date('2008/02/07'), new Date('2008/09/07'));
timeframe_2 = new Timeframe(new Date('2008/02/07'), new Date('2008/09/07'));
assert.similar(timeframe_1, timeframe_2, 'Two timeframes with same start dates and same stop dates are similar');

timeframe_2 = new Timeframe(new Date('2008/02/07'), new Date('2008/08/07'));
assert.notSimilar(timeframe_1, timeframe_2, 'Two timeframes with same start dates and different stop dates are not similar');

//infinite time frame equal
timeframe_1 = new Timeframe(new Date('2008/02/07'));
timeframe_2 = new Timeframe(new Date('2008/02/07'));
assert.similar(timeframe_1, timeframe_2, 'Two timeframes with same start dates and no stop dates are similar');

timeframe_2 = new Timeframe(new Date('2008/02/07'), new Date('2008/08/07'));
assert.notSimilar(timeframe_1, timeframe_2, 'Two timeframes with same start dates and different stop dates are not similar');

assert.end();