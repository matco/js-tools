interface ObjectConstructor {
	isObject(object: any): boolean;
	isEmpty(object: any): boolean;
	equals(object1: any, object2: any): boolean;
	key(object: any, value: any): any;
	clone(object: any): any;
	getObjectPathValue(object: any, path: string): any;
	getLastObjectInPath(object: any, path: string): any;
}

interface FunctionConstructor {
	isFunction(f: any): boolean;
}

interface Function {
	negatize(): any;
	callbackize(): any;
}

interface StringConstructor {
	isString(n: any): boolean;
}

interface String {
	capitalize(): string;
	reverse(): string;
	nocaseIncludes(string: string): boolean;
	compareTo(string: string): number;
	replaceObject(object: any): string;
	getBytes(): Array<number>;
}

interface Boolean {
	compareTo(boolean: boolean): number;
}

interface NumberConstructor {
	isNumber(n: any): boolean;
}

interface Number {
	compareTo(number: number): number;
	pad(length: number, pad?: string): string;
}

interface Array {
	isEmpty(): boolean;
	last(): any;
	first(): any;

	indexOfSame(element: any): number;
	includesSame(element: any): boolean;
	includesAll(elements: any): boolean;
	includesOne(elements: any): boolean;

	pushAll(elements: Array);
	insert(number: number, object: any);
	remove(index: number);
	remove(from: number, to: number);
	removeElement(element: any);
	removeElements(elements: Array<any>);

	replace(oldElement: any, newElement: any);
};

interface DateConstructor {
	isDate(object: any): boolean;
	isValidDate(object: any): boolean;
	getDifferenceInDays(start: Date, stop: Date): number;
	getDifferenceInHours(start: Date, stop: Date): number;
	getDifferenceInMinutes(start: Date, stop: Date): number;
	getDifferenceInSeconds(start: Date, stop: Date): number;
	parseToDisplay(date: string): Date;
	parseToFullDisplay(date: string): Date;
	parseToFullDisplayUTC(date: string): Date;
	getDurationLiteral(duration: number): string;

	SECONDS_IN_MINUTE: number;
	MINUTES_IN_HOUR: number;
	HOURS_IN_DAY: number;

	MS_IN_SECOND: number;
	MS_IN_MINUTE: number;
	MS_IN_HOUR: number;
	MS_IN_DAY: number;

	locale: any;
}
interface Date {
	toDisplay(): string;
	toFullDisplay(): string;
	format(formatter: string): string;
	toUTCDisplay(): string;
	toUTCFullDisplay(): string;
	formatUTC(formatter: string): string;

	getDayName(language: string): string;
	getDayNameShort(language: string): string;
	getMonthName(language: string): string;
	getMonthNameShort(language: string): string;

	equals(otherDate: Date): boolean;
	compareTo(otherDate: Date): number;

	isBefore(otherDate: Date): boolean;
	isAfter(otherDate: Date): boolean;

	clone(): Date;

	addSeconds(seconds: number): Date;
	addMinutes(minutes: number): Date;
	addHours(hours: number): Date;
	addDays(days: number): Date;
	addMonths(months: number): Date;
	addYears(years: number): Date;

	roundToDay(): Date;
	roundToHour(): Date;
	roundToMinute(): Date;

	getAge(): number;
	getAgeLiteral(): string;
}
