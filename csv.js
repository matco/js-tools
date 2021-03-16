const regexp = /"/g;

function generate_line(line) {
	return line
		.map(cell => cell || '')
		.map(cell => `"${cell.replace(regexp, '""')}"`)
		.join(',');
}

class CSV {
	constructor(data) {
		this.data = data;
	}
	toString() {
		return this.data.map(generate_line).join('\n');
	}
	toBlob() {
		return new Blob([this.toString()], {type: CSV.MIME_TYPE});
	}
	download(name) {
		const filename = name || new Date().toFullDisplay();
		const blob = this.toBlob();
		const file = new File([blob], filename, {type: CSV.MIME_TYPE, lastModified: Date.now()});
		const url = URL.createObjectURL(file);
		//Chrome does not support to set location href
		if(/Chrome/.test(navigator.userAgent)) {
			const link = document.createFullElement('a', {href: url, download: filename});
			//add link in the current document to be able to test the the download
			//if the link is not included in the document, there is no way to detect if it has been "used" (created and programmatically clicked) in tests
			document.body.appendChild(link); //this line is only for tests to be able to detect the click on the link
			const event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			link.dispatchEvent(event);
			//remove link because it is useless
			link.remove();
		}
		else {
			location.href = url;
		}
		//revoke url after event has been dispatched
		setTimeout(() => URL.revokeObjectURL(url), 0);
	}
}

CSV.DECIMAL_SEPARATOR = 1.1.toLocaleString().substring(1, 2);
CSV.MIME_TYPE = 'text/csv';

export {CSV};
