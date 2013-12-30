'use strict';

assert.begin();

var timeframe;
timeframe = new Timeframe(new Date('2004/02/26'), new  Date('2004/02/27'));
assert.equal(timeframe.getDays(), 1, 'There is 1 day between [2004/02/26] and [2004/02/27]');
timeframe = new Timeframe(new Date('2004/02/26'), new  Date('2004/02/27'));
assert.equal(timeframe.getDays(), 1, 'There is 1 days between [2004/02/26] and [2004/02/27]');
timeframe = new Timeframe(new Date('2004/02/26'), new  Date('2004/03/01'));
assert.equal(timeframe.getDays(), 4, 'There is 4 days between [2004/02/26] and [2004/03/01]');
timeframe = new Timeframe(new Date('2010/12/31'), new  Date('2010/12/31'));
assert.equal(timeframe.getDays(), 0, 'There is 0 day between [2010/12/31] and [2010/12/31]');

timeframe = new Timeframe(new Date('2010/12/27'), new  Date('2010/12/31'));
assert.equal(timeframe.getDays(), 4, 'There is 4 days between [2010/12/27] and [2010/12/31]');
timeframe.shift(7);
assert.equal(timeframe.getDays(), 4, 'There is still 4 days between [2010/12/27] and [2010/12/31] with a shift of 7 days');
assert.equal(timeframe.startDate.toDisplay(), '03.01.2011', 'Timeframe beginning [2010/12/27] begins [2011/01/03] with a shift of 7 days');
assert.equal(timeframe.stopDate.toDisplay(), '07.01.2011', 'Timeframe ending [2010/12/31] ends [2011/01/06] with a shift of 7 days');

var date_1 = new Date('2009/04/01');
var date_2 = new Date('2009/08/01');
var timeframe_1 = new Timeframe(new Date('2009/02/01'), new  Date('2009/10/01'));

assert.ok(timeframe_1.surround(date_1), '2009/04/01 is between 2009/02/01 and 2009/10/01');
assert.ok(timeframe_1.surround(date_2), '2009/08/01 is between 2009/02/01 and 2009/10/01');
assert.ok(!timeframe_1.surround(new Date('2009/01/25')), '2009/01/25 is not between 2009/02/01 and 2009/10/01');

var timeframe_2 = new Timeframe(date_1, date_2);
assert.ok(timeframe_1.overlap(timeframe_2), 'Timeframe [2009/04/01 to 2009/08/01] overlaps Timeframe [2009/02/01 to 2009/10/01]');

timeframe_1 = new Timeframe(new  Date('2008/02/07'), new  Date('2008/09/07'));
timeframe_2 = new Timeframe(new  Date('2010/01/07'), new  Date('2010/02/20'));
assert.ok(!timeframe_1.overlap(timeframe_2), 'Timeframe [2008/02/07 to 2008/09/07] does not overlap Timeframe [2010/01/07 to 2010/02/20]');

timeframe_1 = new Timeframe(new  Date('2008/02/07'), new  Date('2008/09/07'));
timeframe_2 = new Timeframe(new  Date('2008/02/07'), new  Date('2008/09/07'));
assert.ok(timeframe_1.overlap(timeframe_2), 'Timeframe [2008/02/07 to 2008/02/07] overlaps Timeframe [2008/02/07 to 2008/02/07]');

assert.end();