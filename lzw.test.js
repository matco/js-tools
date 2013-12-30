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
encoded_text = 'TOBEORNOTĀĂĄĉăąć'
assert.equal(LZW.CompressToString(text), encoded_text, 'LZW for "TOBEORNOTTOBEORTOBEORNOT" is "TOBEORNOTĀĂĄĉăąć" or "TOBEORNOT<256><258><260><265><259><261><263>"');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = 'some text will no encode';
assert.equal(LZW.CompressToString(text), text, 'LZW for "some text will no encode" is "some text will no encode"');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = 'a	text	with	some	tabulations';
encoded_text = 'a	text	with	someāabulations';
assert.equal(LZW.CompressToString(text), encoded_text, 'LZW for "a	text	with	some	tabulations" is "a	text	with	someāabulations"');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = '{"id": "Test","shortname": {"en": "Test",},"longname": {"en": "Test",},"description": {},"url": "http://127.0.0.1:8080","email": "info@rodanotech.ch","emailCheckMode": "NONE","passwordStrong": false,"passwordLength": 4,"passwordValidityDuration": 0,"passwordMaxAttemptsPerDay": 0,"passwordUniqueness": false,"introductionText": "Rodano Test Study","copyright": "Copyright &#169; 2008-2011 RODANOTECH, All rights reserved.","configVersion": 5,"configDate": 1348752519734,"configUser": "mcorag","languageIds": ["en","fr"],"defaultLanguageId": "en","userAttributes": ["PHONE"],"countries": {"FR": {"id": "FR","shortname": {"en": "France"},"longname": {},"description": {},"entity": "COUNTRY"},"GB": {"id": "GB","shortname": {"en": "United Kindgow"},"longname": {},"description": {},"entity": "COUNTRY"}},"languages": {},"scopeModels": {"Country": {"id": "Country","shortname": {"en": "Country",},"pluralShortname": {"en": "Countries",},"longname": {"en": "Country",},"description": {},"defaultParentId": "Study","parents": ["Study"],"virtual": false,"scopeFormat": "${parent}-${siblingsNumber:2}","modificationDate": "2009-04-28T19:38:35.000+0000","workflows": [],"crfMode": "NORMAL","color": "#72bf44","searchComplements": false,"entity": "SCOPE_MODEL"},"Patient": {"id": "Patient","shortname": {"en": "Patient",},"pluralShortname": {"en": "Patients",},"longname": {"en": "Patient",},"description": {},"defaultParentId": "Center","parents": ["Center"],"virtual": false,"maxNumber": 600,"scopeFormat": "${parent}-${siblingsNumber:2}","modificationDate": "2009-04-29T11:16:40.000+0000","workflows": [],"crfMode": "NORMAL","scopesPerPage": 200,"searchComplements": false,"entity": "SCOPE_MODEL"}}}';
encoded_text = '{"id": "Test","shortnameĄ ĀenĘćĉċ,}člongĔĖĘĚĜąĞĊČĢ"dĉcriptiĥĪıurlĝhttp://127.0Ō.1:80ŒČ"emaiŀĭinfo@rodanotech.ŪŕŗřlChũkMţėĭNONEŕpasswđdStŢĦĘfalsečſƁƃrdLěgthĘ4ƐƀƂƄVƌĂityDľaĹĻą0ƝƒƄMaxAŃŗĸsPerDayĘƭ"ƑƟƔUniquěĉsƊƌƎčŝƇţucƪnĈxċĭRţťo ĈĊ ƆudƾčcopyĶgłĝCǪǬiǮt &#169; 20œ-ǿ11 RODAźTECH, All ǭłsȕĉƺved.ŕǩŞǴVƺsĺĬ 5ǨĥfǴƼŨĘ13487525197ȳȫȢgUƎrĝmǩragŕlťguɈeIdǌą[ŖĜčfɃ]čĳƋultLɌɎgɐăĭěŕuɂƴƇibuŨɓ ɕPHŻŽɛ"ǩunɮĉĪ"FRʁĂĝʃŕďđēĕŸęɖʇɇncėıĤĦĨʎ{ıĳsĵķǖļčěĹƥǰOUNTRY"ıGBʅɧĆʰʉĐĒʙʁɩĭǅƤȝ KŝdgowʮģĥħʍʢĲĴĶĸȧˌʤƤƾĭCʨʪʬʮʖɣɏɳʛčʞǪeŶĳƍʁǱɽƇ˕ʏʆ˖o˪rǧĎʷʌĩąīǰ˰ɾ˲İƐlƨlS˵ʹ˸ʐ˯˱iʀġˈʘˋ̆ʻĆ˩˼ǧʜˎʠˑ˸̖ɞɠParʤɑĝǤǦž̟ʤɳɕ̤ƾɺviĒɎś ƋƍƏĎǩpeFđŘǚĆ${ſ̠ɾ}-̀ȦblŝgsNumbƺ:2}ŕmţiȭcƩȧȯʎ"ǿ09-04Ȃ8TȺ:38ͫ5ŌȀ+ȀȀŕƓkfĤw̩ɺĵf˥͟źRMALȠoĤɃĭ#72bf44ʉe̟ŪǱmplŗ̨Ǎ̵ʣɾ˔̣˗PE_MȈE΅ı̞ĹʤʲĝΫ̊ɾʶʋ̅ʏ̑"ΰέ̌ǁ̀ɇ̂̄̏ζȨθ͜Λλʗˊ˷ςίυβλʝʟːƫę̛aɟt̞̓t̢˖ʤƺ̦Ϛ̩"CϞɚč̮̰ƌΜǏ"Řx͎͐ϟą6Ȁˡ̸̺̼Ʃĝ̀͂ʤ͇ͅɯ͊Ħ͍͏͑r͓͕č͗d͙i͛ǖ͞ĝͣͥ͡Ȃ9ͩŐǺ:4ōͳͲͳ͵đͷ͹ͻǨr;ŷĝ΁΃΅϶ˣƸƺ̞ɥĘ͡ˡΓrΕoΗΙĖɾɳ̴Ϭ˓ʦĭS΢ΤΦDΨ˛}';
assert.equal(LZW.CompressToString(text), encoded_text, 'LZW can encodes long text');
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW encoding then decoding a text gives the same text');

text = '$42!-21=abc';
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW works with not so special characters');

text = '$42!-21=abc42!def42!ghi42!^';
assert.equal(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW works with not so special characters');

text = 'ɖƇƳƏœʡӮ';
assert.notEqual(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW does not works with characters code greater than 256 (using more than 8 bits)');

text = '►◄▬■☺♥';
assert.notEqual(LZW.DecompressString(LZW.CompressToString(text)), text, 'LZW does not works with characters code greater than 256 (using more than 8 bits)');

//test with big data
(function() {
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
		}
	);
	xhr.open('GET', '/configs/test/test.json', true);
	xhr.send(null);
})();

//test with very big data which can exceed 2^16 for the dictionary
(function() {
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
	xhr.open('GET', '/configs/msbase/msbase.json', true);
	xhr.send(null);
})();
