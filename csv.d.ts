
export class CSV {
	constructor(data: Array<Array<string>>)
	toString(): string
	toBlob(): Blob
	download(filename: string);
}
