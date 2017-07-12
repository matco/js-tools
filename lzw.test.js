'use strict';

assert.begin();

var text = 'taratata';
var encoded_text = 'taraĀĀ';
assert.similar(LZW.Compress(text), [116, 97, 114, 97, 256, 256], 'LZW for "taratata" is array of integers [116, 97, 114, 97, 256, 256]');
assert.equal(LZW.CompressToString(text), encoded_text, 'LZW string for "taratata" is "taraĀĀ"');

assert.equal(LZW.Decompress([116, 97, 114, 97, 256, 256]), text, 'LZW decompress for array of integers [116, 97, 114, 97, 256, 256] is "taratata"');
assert.equal(LZW.DecompressString(encoded_text), text, 'LZW decompress for string "taraĀĀ" is "taratata"');

assert.equal(LZW.Decompress(LZW.Compress(text)), text, 'LZW encoding then decoding a text gives the same text');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding a text to string then decoding gives the same text');

text = 'TOBEORNOTTOBEORTOBEORNOT';
encoded_text = 'TOBEORNOTĀĂĄĉăąć';
assert.equal(LZW.CompressToString(text), encoded_text, 'LZW for "TOBEORNOTTOBEORTOBEORNOT" is "TOBEORNOTĀĂĄĉăąć" or "TOBEORNOT<256><258><260><265><259><261><263>"');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = 'some text will no encode';
assert.equal(LZW.CompressToString(text), text, 'LZW for "some text will no encode" is "some text will no encode"');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = 'a	text	with	some	tabulations';
encoded_text = 'a	text	with	someāabulations';
assert.equal(LZW.CompressToString(text), encoded_text, 'LZW for "a	text	with	some	tabulations" is "a	text	with	someāabulations"');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = 'This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means. In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. For more information, please refer to <http://unlicense.org>';
encoded_text = LZW.CompressToString(text);
assert.ok((encoded_text.length - text.length) < 0, 'Encoded text is shorter than text');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = '$42!-21=abc';
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW works with not so special characters');

text = '$42!-21=abc42!def42!ghi42!^';
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW works with not so special characters');

text = '5≤6 and 6≥5';
assert.notEqual(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW does not works with characters code greater than 256 (using more than 8 bits)');

text = 'ɖƇƳƏœʡӮ';
assert.notEqual(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW does not works with characters code greater than 256 (using more than 8 bits)');

text = '►◄▬■☺♥';
assert.notEqual(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW does not works with characters code greater than 256 (using more than 8 bits)');

//test with big data
function test_big_data(callback) {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener(
		'load',
		function(event) {
			var config = event.target.response;
			var compressed_config, uncompressed_config;

			compressed_config = LZW.Compress(config);
			uncompressed_config = LZW.Decompress(compressed_config);
			assert.equal(config, uncompressed_config, 'LZW works with big files');

			compressed_config = LZW.CompressToString(config);
			uncompressed_config = LZW.DecompressString(compressed_config);
			assert.equal(config, uncompressed_config, 'LZW works with big files');

			test_very_big_data();
		}
	);
	xhr.open('GET', 'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js', true);
	xhr.send();
}

//test with very big data which can exceed 2^16 for the dictionary
function test_very_big_data() {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener(
		'load',
		function(event) {
			var config = event.target.response;
			var compressed_config, uncompressed_config;

			compressed_config = LZW.Compress(config);
			uncompressed_config = LZW.Decompress(compressed_config);
			assert.equal(config, uncompressed_config, 'LZW works with very big files');

			compressed_config = LZW.CompressToString(config);
			uncompressed_config = LZW.DecompressString(compressed_config);
			assert.equal(config, uncompressed_config, 'LZW works with very big files');

			assert.end();
		}
	);
	xhr.open('GET', 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js', true);
	xhr.send();
};

test_big_data();
