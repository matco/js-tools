export class PromiseQueue {
	constructor(resultCallback?: (result: any) => any)
	run()
	add(promise: Promise)
	addAll(promises: Array<Promise>)
	clear()
	then(callback: (result: any) => any)
	catch(callback: (result: any) => any)
}
