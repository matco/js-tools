'use strict';

function Timeframe(startDate, stopDate) {
	this.startDate = startDate;
	this.stopDate = stopDate;
}
Timeframe.prototype.getDays = function() {
	return Date.getDifferenceInDays(this.startDate, this.stopDate);
};
Timeframe.prototype.getHours = function() {
	return Date.getDifferenceInHours(this.startDate, this.stopDate);
};
Timeframe.prototype.getMinutes = function() {
	return Date.getDifferenceInMinutes(this.startDate, this.stopDate);
};
Timeframe.prototype.getSeconds = function() {
	return Date.getDifferenceInSeconds(this.startDate, this.stopDate);
};

Timeframe.prototype.clone = function() {
	return new Timeframe(this.startDate.clone(), this.stopDate.clone());
};
Timeframe.prototype.surround = function(date) {
	return this.startDate <= date && this.stopDate >= date;
};
Timeframe.prototype.overlap = function(timeframe) {
	return this.surround(timeframe.startDate) || this.surround(timeframe.stopDate) || timeframe.surround(this.startDate) || timeframe.surround(this.stopDate);
};
Timeframe.prototype.toString = function() {
	return this.startDate + ' - ' + this.stopDate;
};
Timeframe.prototype.equals = function(timeframe) {
	return this.startDate.getTime() === timeframe.startDate.getTime() && this.stopDate.getTime() === timeframe.stopDate.getTime();
};

Timeframe.prototype.extendPercentage = function(percentage) {
	var margin = Math.floor(this.getSeconds() * percentage / 100);
	this.startDate.addSeconds(-margin);
	this.stopDate.addSeconds(margin);
	return this;
};
Timeframe.prototype.extendDays = function(days) {
	var margin = Math.floor(days / 2);
	this.startDate.addDays(-margin);
	this.stopDate.addDays(margin);
	return this;
};
Timeframe.prototype.extendHours = function(hours) {
	var margin = Math.floor(hours / 2);
	this.startDate.addHours(-margin);
	this.stopDate.addHours(margin);
	return this;
};
Timeframe.prototype.extendMinutes = function(minutes) {
	var margin = Math.floor(minutes / 2);
	this.startDate.addMinutes(-margin);
	this.stopDate.addMinutes(margin);
	return this;
};
Timeframe.prototype.extendSeconds = function(seconds) {
	var margin = Math.floor(seconds / 2);
	this.startDate.addSeconds(-margin);
	this.stopDate.addSeconds(margin);
	return this;
};

Timeframe.prototype.roundToDay = function() {
	this.roundToHour();
	this.startDate.roundToDay();
	this.stopDate.roundToDay();
	return this;
};
Timeframe.prototype.roundToHour = function() {
	this.startDate.roundToHour();
	this.stopDate.roundToHour();
	return this;
};
Timeframe.prototype.roundToMinute = function() {
	this.startDate.roundToMinute();
	this.stopDate.roundToMinute();
	return this;
};

Timeframe.prototype.shiftHours = function(hours) {
	this.startDate.addHours(hours);
	this.stopDate.addHours(hours);
	return this;
};
Timeframe.prototype.shiftMinutes = function(minutes) {
	this.startDate.addMinutes(minutes);
	this.stopDate.addMinutes(minutes);
	return this;
};
Timeframe.prototype.shiftSeconds = function(seconds) {
	this.startDate.addSeconds(seconds);
	this.stopDate.addSeconds(seconds);
	return this;
};

Timeframe.prototype.shiftDays = function(days) {
	this.startDate.addDays(days);
	this.stopDate.addDays(days);
	return this;
};
Timeframe.prototype.shiftHours = function(hours) {
	this.startDate.addHours(hours);
	this.stopDate.addHours(hours);
	return this;
};
Timeframe.prototype.shiftMinutes = function(minutes) {
	this.startDate.addMinutes(minutes);
	this.stopDate.addMinutes(minutes);
	return this;
};
Timeframe.prototype.shiftSeconds = function(seconds) {
	this.startDate.addSeconds(seconds);
	this.stopDate.addSeconds(seconds);
	return this;
};