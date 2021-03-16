interface Document {
	createFullElement<K extends keyof HTMLElementTagNameMap>(tag: K, attributes?: object, text?: string, listeners?: {[key: string]: (this: Element, event: any) => any;}): HTMLElementTagNameMap[K];
	createFullElement(tag: string, attributes?: object, text?: string, listeners?: {[key: string]: (this: Element, event: any) => any;}): HTMLElement;
	createFullElementNS<K extends keyof HTMLElementTagNameMap>(ns: string, tag: K, attributes?: object, text?: string, listeners?: {[key: string]: (this: Element, event: any) => any;}): HTMLElementTagNameMap[K];
	createFullElementNS(ns: string, tag: string, attributes?: object, text?: string, listeners?: {[key: string]: (this: Element, event: any) => any;}): Element;
}

interface Node {
	clear(): Node;
	appendChildren(nodes: Array<Node>): void;
}

interface NodeList {
	indexOf(element: Node): number;
	includes(element: Node): boolean;
	slice(start?: number, end?: number): Array<Node>;

	forEach(callback: Function, that?: any): void;
	map(callback: Function, that?: any): Array<Node>;
	find(callback: Function, that?: any): Node;
	filter(callback: Function, that?: any): Array<Node>;
	every(callback: Function, that?: any): boolean;
	some(callback: Function, that?: any): boolean;
}

interface NodeListOf<TNode extends Node> extends NodeList {
	indexOf(element: Node): number;
	includes(element: Node): boolean;
	slice(start?: number, end?: number): Array<TNode>;

	forEach(callback: Function, that?: any): void;
	map(callback: Function, that?: any): Array<TNode>;
	find(callback: Function, that?: any): TNode;
	filter(callback: Function, that?: any): Array<TNode>;
	every(callback: Function, that?: any): boolean;
	some(callback: Function, that?: any): boolean;
}

interface Element {
	clear(selector?: string): Element;
	setAttributes(attributes: object): Element;
	getPosition(): {left: number; top: number;};
}

interface HTMLCollectionBase {
	indexOf(element: HTMLElement): number;
	includes(element: HTMLElement): boolean;
	slice(start?: number, end?: number): Array<any>;

	first(): HTMLElement;
	last(): HTMLElement;
	isEmpty(): boolean;

	sort(comparator: (element1, element2) => number);
	slice(): Array<any>;

	forEach(callback: Function, that?: any): void;
	map(callback: Function, that?: any): Array<HTMLElement>;
	find(callback: Function, that?: any): HTMLElement;
	filter(callback: Function, that?: any): Array<HTMLElement>;
	every(callback: Function, that?: any): boolean;
	some(callback: Function, that?: any): boolean;
}

interface HTMLFormElement {
	disable(): void;
	enable(): void;
}

interface HTMLDataListElement {
	fill(entries: Array<string> | {[key: string]: string;}, blank_entry: boolean, selected_entries: any): void;
	fillObjects<T>(objects: Array<any>, value_property: string | ((object: T) => string), label_property: string | ((object: T) => string), blank_entry: boolean, selected_entries: any): void;
}

interface HTMLSelectElement {
	fill(entries: Array<string> | {[key: string]: string;}, blank_entry: boolean, selected_entries: any): void;
	fillObjects<T>(objects:  Array<T>, value_property: string | ((object: T) => string), label_property: string | ((object: T) => string), blank_entry: boolean, selected_entries: any): void;
}

interface Storage {
	setObject(key: string, value: any);
	getObject(key: string);
}

interface Event {
	stop();
}