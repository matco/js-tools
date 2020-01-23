export class Timeframe {
	constructor(startDate: Date, stopDate: Date)
	isInfinite(): boolean
	isStaked(): boolean
	getDays(): number
	getHours(): number
	getMinutes(): number
	getSeconds(): number
	clone(): Timeframe
	surround(date: Date): boolean
	overlap(timeframe: Timeframe): boolean
	toString(): string;
	equals(timeframe: Timeframe): boolean
	extendPercentage(percentage: number): Timeframe
	extendDays(days: number): Timeframe
	extendHours(hours: number): Timeframe
	extendMinutes(minutes: number): Timeframe
	extendSeconds(seconds: number): Timeframe
	roundToDay(): Timeframe
	roundToHour(): Timeframe
	roundToMinute(): Timeframe
	shiftDays(days: number): Timeframe
	shiftHours(hours: number): Timeframe
	shiftMinutes(minutes: number): Timeframe
	shiftSeconds(seconds: number): Timeframe
	shiftStartDate(date: Date): Timeframe
	shiftStopDate(date: Date): Timeframe
	isBefore(timeframe: Timeframe): boolean
	isAfter(timeframe: Timeframe): boolean
}
