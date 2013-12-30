/*globals deepEqual, JES, strictEqual, test, Uint8Array, XMLHttpRequest*/
/*jslint newcap:true, bitwise:true*/

(function () {
	"use strict";

	test("error()", function () {
		var errors1 = {
			"test": {
				variable: "123",
				conditions: [undefined, false, ""],
				message: "Test error"
			}
		},
			errors2 = {
				"test": {
					variable: "",
					conditions: [undefined, false, ""],
					message: "Test error"
				}
			};

		strictEqual(JES.error(errors1), false);
		strictEqual(JES.error(errors2), true);
	});

	test("clone()", function () {
		var arr1 = [
			[0x00, 0x04, 0x08, 0x0c],
			[0x01, 0x05, 0x09, 0x0d],
			[0x02, 0x06, 0x0a, 0x0e],
			[0x03, 0x07, 0x0b, 0x0f]
		];

		deepEqual(JES.clone(arr1), [
			[0x00, 0x04, 0x08, 0x0c],
			[0x01, 0x05, 0x09, 0x0d],
			[0x02, 0x06, 0x0a, 0x0e],
			[0x03, 0x07, 0x0b, 0x0f]
		]);
	});

	test("blockXOR()", function () {
		var arr1 = [
			[0x00, 0x04, 0x08, 0x0c],
			[0x01, 0x05, 0x09, 0x0d],
			[0x02, 0x06, 0x0a, 0x0e],
			[0x03, 0x07, 0x0b, 0x0f]
		],
			arr2 = [
				[0x10, 0x14, 0x18, 0x1c],
				[0x11, 0x15, 0x19, 0x1d],
				[0x12, 0x16, 0x1a, 0x1e],
				[0x13, 0x17, 0x1b, 0x1f]
			],
			arr3 = [
				[0x20, 0x24, 0x28, 0x2c],
				[0x21, 0x25, 0x29, 0x2d],
				[0x22, 0x26, 0x2a, 0x2e],
				[0x23, 0x27, 0x2b, 0x2f]
			];

		deepEqual(JES.blockXOR(arr1, arr2), [
			[0x10, 0x10, 0x10, 0x10],
			[0x10, 0x10, 0x10, 0x10],
			[0x10, 0x10, 0x10, 0x10],
			[0x10, 0x10, 0x10, 0x10]
		]);

		deepEqual(JES.blockXOR(arr1, arr2, arr3), [
			[0x30, 0x34, 0x38, 0x3c],
			[0x31, 0x35, 0x39, 0x3d],
			[0x32, 0x36, 0x3a, 0x3e],
			[0x33, 0x37, 0x3b, 0x3f]
		]);
	});

	test("output()", function () {
		var output_array = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];

		deepEqual(JES.output(output_array, "hex/array"), [
			"00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f"
		]);
		strictEqual(JES.output(output_array, "hex/string"), "000102030405060708090a0b0c0d0e0f");
		deepEqual(JES.output(output_array, "ascii/array"), [
			String.fromCharCode(0x00),
			String.fromCharCode(0x01),
			String.fromCharCode(0x02),
			String.fromCharCode(0x03),
			String.fromCharCode(0x04),
			String.fromCharCode(0x05),
			String.fromCharCode(0x06),
			String.fromCharCode(0x07),
			String.fromCharCode(0x08),
			String.fromCharCode(0x09),
			String.fromCharCode(0x0a),
			String.fromCharCode(0x0b),
			String.fromCharCode(0x0c),
			String.fromCharCode(0x0d),
			String.fromCharCode(0x0e),
			String.fromCharCode(0x0f)
		]);
		deepEqual(JES.output(output_array, "int/array"), [
			0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
		]);
		strictEqual(JES.output(output_array), String.fromCharCode(0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f));
	});

	test("subBytes()", function () {
		var state = [
			[0x19, 0xa0, 0x9a, 0xe9],
			[0x3d, 0xf4, 0xc6, 0xf8],
			[0xe3, 0xe2, 0x8d, 0x48],
			[0xbe, 0x2b, 0x2a, 0x08]
		];

		deepEqual(JES.subBytes(state), [
			[0xd4, 0xe0, 0xb8, 0x1e],
			[0x27, 0xbf, 0xb4, 0x41],
			[0x11, 0x98, 0x5d, 0x52],
			[0xae, 0xf1, 0xe5, 0x30]
		]);
	});

	test("subBytes() - Inv", function () {
		var state = [
			[0xca, 0x6d, 0x74, 0x88],
			[0x59, 0xbd, 0x57, 0x73],
			[0x74, 0x2b, 0xea, 0xe8],
			[0x78, 0xfb, 0x0e, 0x2e]
		];

		deepEqual(JES.subBytes(state, true), [
			[0x10, 0xb3, 0xca, 0x97],
			[0x15, 0xcd, 0xda, 0x8f],
			[0xca, 0x0b, 0xbb, 0xc8],
			[0xc1, 0x63, 0xd7, 0xc3]
		]);
	});

	test("shiftRows()", function () {
		var state = [
			[0xd4, 0xe0, 0xb8, 0x1e],
			[0x27, 0xbf, 0xb4, 0x41],
			[0x11, 0x98, 0x5d, 0x52],
			[0xae, 0xf1, 0xe5, 0x30]
		];

		deepEqual(JES.shiftRows(state), [
			[0xd4, 0xe0, 0xb8, 0x1e],
			[0xbf, 0xb4, 0x41, 0x27],
			[0x5d, 0x52, 0x11, 0x98],
			[0x30, 0xae, 0xf1, 0xe5]
		]);
	});

	test("shiftRows() - Inv", function () {
		var state = [
			[0xca, 0x6d, 0x74, 0x88],
			[0xbd, 0x57, 0x73, 0x59],
			[0xea, 0xe8, 0x74, 0x2b],
			[0x2e, 0x78, 0xfb, 0x0e]
		];

		deepEqual(JES.shiftRows(state, true), [
			[0xca, 0x6d, 0x74, 0x88],
			[0x59, 0xbd, 0x57, 0x73],
			[0x74, 0x2b, 0xea, 0xe8],
			[0x78, 0xfb, 0x0e, 0x2e]
		]);
	});

	test("mixColumns()", function () {
		var state = [
			[0xd4, 0xe0, 0xb8, 0x1e],
			[0xbf, 0xb4, 0x41, 0x27],
			[0x5d, 0x52, 0x11, 0x98],
			[0x30, 0xae, 0xf1, 0xe5]
		];

		deepEqual(JES.mixColumns(state), [
			[0x04, 0xe0, 0x48, 0x28],
			[0x66, 0xcb, 0xf8, 0x06],
			[0x81, 0x19, 0xd3, 0x26],
			[0xe5, 0x9a, 0x7a, 0x4c]
		]);
	});

	test("mixColumns() - Inv", function () {
		var state = [
			[0xbd, 0xf2, 0x0b, 0x8b],
			[0x6e, 0xb5, 0x61, 0x10],
			[0x7c, 0x77, 0x21, 0xb6],
			[0x3d, 0x9e, 0x6e, 0x89]
		];

		deepEqual(JES.mixColumns(state, true), [
			[0x47, 0xf7, 0x61, 0xa1],
			[0x73, 0x2f, 0xcb, 0xe6],
			[0xb9, 0x35, 0x01, 0xcf],
			[0x1f, 0x43, 0x8e, 0x2c]
		]);
	});

	test("addRoundKey()", function () {
		var state = [
			[0x04, 0xe0, 0x48, 0x28],
			[0x66, 0xcb, 0xf8, 0x06],
			[0x81, 0x19, 0xd3, 0x26],
			[0xe5, 0x9a, 0x7a, 0x4c]
		],
			key = [
				[0xa0, 0x88, 0x23, 0x2a],
				[0xfa, 0x54, 0xa3, 0x6c],
				[0xfe, 0x2c, 0x39, 0x76],
				[0x17, 0xb1, 0x39, 0x05]
			];

		deepEqual(JES.addRoundKey(state, key), [
			[0xa4, 0x68, 0x6b, 0x02],
			[0x9c, 0x9f, 0x5b, 0x6a],
			[0x7f, 0x35, 0xea, 0x50],
			[0xf2, 0x2b, 0x43, 0x49]
		]);
	});

	test("keySchedule()", function () {
		var key = [
			[0x2b, 0x28, 0xab, 0x09],
			[0x7e, 0xae, 0xf7, 0xcf],
			[0x15, 0xd2, 0x15, 0x4f],
			[0x16, 0xa6, 0x88, 0x3c]
		],
			keys = JES.keySchedule(key, 1);

		deepEqual(keys[1], [
			[0xa0, 0x88, 0x23, 0x2a],
			[0xfa, 0x54, 0xa3, 0x6c],
			[0xfe, 0x2c, 0x39, 0x76],
			[0x17, 0xb1, 0x39, 0x05]
		]);
	});

	test("keySchedule() x 10", function () {
		var key = [
			[0x2b, 0x28, 0xab, 0x09],
			[0x7e, 0xae, 0xf7, 0xcf],
			[0x15, 0xd2, 0x15, 0x4f],
			[0x16, 0xa6, 0x88, 0x3c]
		],
			keys = JES.keySchedule(key, 10);

		deepEqual(keys[10], [
			[0xd0, 0xc9, 0xe1, 0xb6],
			[0x14, 0xee, 0x3f, 0x63],
			[0xf9, 0x25, 0x0c, 0x0c],
			[0xa8, 0x89, 0xc8, 0xa6]
		]);
	});

	test("toKey()", function () {
		var pass = "6162636465666768696a6b6c6d6e6f70";

		deepEqual(JES.toKey(pass), [
			[0x61, 0x65, 0x69, 0x6d],
			[0x62, 0x66, 0x6a, 0x6e],
			[0x63, 0x67, 0x6b, 0x6f],
			[0x64, 0x68, 0x6c, 0x70]
		]);
	});

	test("toBlocks()", function () {
		var input = [
			"When in disgrace with fortune in",
			"abcdefghijklmnopq"
		];

		deepEqual(JES.toBlocks(input[0]), [
			[
				[0x57, 0x20, 0x64, 0x72],
				[0x68, 0x69, 0x69, 0x61],
				[0x65, 0x6e, 0x73, 0x63],
				[0x6e, 0x20, 0x67, 0x65]
			],
			[
				[0x20, 0x68, 0x72, 0x65],
				[0x77, 0x20, 0x74, 0x20],
				[0x69, 0x66, 0x75, 0x69],
				[0x74, 0x6f, 0x6e, 0x6e]
			],
			[
				[0x10, 0x10, 0x10, 0x10],
				[0x10, 0x10, 0x10, 0x10],
				[0x10, 0x10, 0x10, 0x10],
				[0x10, 0x10, 0x10, 0x10]
			]
		]);

		deepEqual(JES.toBlocks(input[1]), [
			[
				[0x61, 0x65, 0x69, 0x6d],
				[0x62, 0x66, 0x6a, 0x6e],
				[0x63, 0x67, 0x6b, 0x6f],
				[0x64, 0x68, 0x6c, 0x70]
			],
			[
				[0x71, 0x0f, 0x0f, 0x0f],
				[0x0f, 0x0f, 0x0f, 0x0f],
				[0x0f, 0x0f, 0x0f, 0x0f],
				[0x0f, 0x0f, 0x0f, 0x0f]
			]
		]);
	});

	test("encrypt()", function () {
		var input = "Attack at dawn!!",
			pass = "6162636465666768696a6b6c6d6e6f70",
			iv = "7172737475767778797a7b7c7d7e7f80",
			obj = {
				input: input,
				pass: pass,
				iv: iv
			};

		strictEqual(JES.encrypt(obj), String.fromCharCode(0xd7, 0x9f, 0x73, 0xc1, 0x46, 0x19, 0xe3, 0x78, 0xb0, 0x2a, 0xea, 0xe3, 0x5d, 0x8f, 0xf4, 0x3f) +
									  String.fromCharCode(0x5e, 0xae, 0x3d, 0x97, 0xf3, 0xe6, 0x38, 0x40, 0xed, 0x20, 0x69, 0xde, 0xad, 0xa0, 0xb2, 0x21));
		deepEqual(JES.encrypt(obj, "hex/array"), [
			"d7", "9f", "73", "c1", "46", "19", "e3", "78", "b0", "2a", "ea", "e3", "5d", "8f", "f4", "3f",
			"5e", "ae", "3d", "97", "f3", "e6", "38", "40", "ed", "20", "69", "de", "ad", "a0", "b2", "21"
		]);
		strictEqual(JES.encrypt(obj, "hex/string"), "d79f73c14619e378b02aeae35d8ff43f5eae3d97f3e63840ed2069deada0b221");
		strictEqual(JES.encrypt(obj, "ascii/string"), String.fromCharCode(0xd7, 0x9f, 0x73, 0xc1, 0x46, 0x19, 0xe3, 0x78, 0xb0, 0x2a, 0xea, 0xe3, 0x5d, 0x8f, 0xf4, 0x3f) +
													  String.fromCharCode(0x5e, 0xae, 0x3d, 0x97, 0xf3, 0xe6, 0x38, 0x40, 0xed, 0x20, 0x69, 0xde, 0xad, 0xa0, 0xb2, 0x21));
		deepEqual(JES.encrypt(obj, "ascii/array"), [
			String.fromCharCode(0xd7),
			String.fromCharCode(0x9f),
			String.fromCharCode(0x73),
			String.fromCharCode(0xc1),
			String.fromCharCode(0x46),
			String.fromCharCode(0x19),
			String.fromCharCode(0xe3),
			String.fromCharCode(0x78),
			String.fromCharCode(0xb0),
			String.fromCharCode(0x2a),
			String.fromCharCode(0xea),
			String.fromCharCode(0xe3),
			String.fromCharCode(0x5d),
			String.fromCharCode(0x8f),
			String.fromCharCode(0xf4),
			String.fromCharCode(0x3f),
			String.fromCharCode(0x5e),
			String.fromCharCode(0xae),
			String.fromCharCode(0x3d),
			String.fromCharCode(0x97),
			String.fromCharCode(0xf3),
			String.fromCharCode(0xe6),
			String.fromCharCode(0x38),
			String.fromCharCode(0x40),
			String.fromCharCode(0xed),
			String.fromCharCode(0x20),
			String.fromCharCode(0x69),
			String.fromCharCode(0xde),
			String.fromCharCode(0xad),
			String.fromCharCode(0xa0),
			String.fromCharCode(0xb2),
			String.fromCharCode(0x21)
		]);
		deepEqual(JES.encrypt(obj, "int/array"), [
			0xd7, 0x9f, 0x73, 0xc1, 0x46, 0x19, 0xe3, 0x78, 0xb0, 0x2a, 0xea, 0xe3, 0x5d, 0x8f, 0xf4, 0x3f,
			0x5e, 0xae, 0x3d, 0x97, 0xf3, 0xe6, 0x38, 0x40, 0xed, 0x20, 0x69, 0xde, 0xad, 0xa0, 0xb2, 0x21
		]);
	});

	test("decrypt()", function () {
		var obj = {
				input: String.fromCharCode(0xd7, 0x9f, 0x73, 0xc1, 0x46, 0x19, 0xe3, 0x78, 0xb0, 0x2a, 0xea, 0xe3, 0x5d, 0x8f, 0xf4, 0x3f) +
					   String.fromCharCode(0x5e, 0xae, 0x3d, 0x97, 0xf3, 0xe6, 0x38, 0x40, 0xed, 0x20, 0x69, 0xde, 0xad, 0xa0, 0xb2, 0x21),
				pass: "6162636465666768696a6b6c6d6e6f70",
				iv: "7172737475767778797a7b7c7d7e7f80"
			};

		strictEqual(JES.decrypt(obj), "Attack at dawn!!");
		deepEqual(JES.decrypt(obj, "hex/array"), ["41", "74", "74", "61", "63", "6b", "20", "61", "74", "20", "64", "61", "77", "6e", "21", "21"]);
		strictEqual(JES.decrypt(obj, "hex/string"), "41747461636b206174206461776e2121");
		strictEqual(JES.decrypt(obj, "ascii/string"), "Attack at dawn!!");
		deepEqual(JES.decrypt(obj, "ascii/array"), ["A", "t", "t", "a", "c", "k", " ", "a", "t", " ", "d", "a", "w", "n", "!", "!"]);
		deepEqual(JES.decrypt(obj, "int/array"), [0x41, 0x74, 0x74, 0x61, 0x63, 0x6b, 0x20, 0x61, 0x74, 0x20, 0x64, 0x61, 0x77, 0x6e, 0x21, 0x21]);
	});

	(function (url) {
		var xhr = new XMLHttpRequest(),
			arr = [],
			response = "",
			obj = {
				input: "Attack at dawn!!",
				pass: "6162636465666768696a6b6c6d6e6f70",
				iv: "7172737475767778797a7b7c7d7e7f80"
			},
			i = 0;

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				arr = new Uint8Array(xhr.response);

				for (i = 0; i < arr.length; i += 1) {
					response += String.fromCharCode(arr[i]);
				}

				test("encrypt() vs. OpenSSL", function () {
					strictEqual(JES.encrypt(obj, "ascii/string"), response);
				});
			}
		};

		xhr.open("GET", url, true);
		xhr.responseType = "arraybuffer";
		xhr.send(null);
	}("openssl_enc.bin"));

	(function (url) {
		var xhr = new XMLHttpRequest(),
			arr = [],
			response = "",
			obj = {
				input: String.fromCharCode(0xd7, 0x9f, 0x73, 0xc1, 0x46, 0x19, 0xe3, 0x78, 0xb0, 0x2a, 0xea, 0xe3, 0x5d, 0x8f, 0xf4, 0x3f) +
					   String.fromCharCode(0x5e, 0xae, 0x3d, 0x97, 0xf3, 0xe6, 0x38, 0x40, 0xed, 0x20, 0x69, 0xde, 0xad, 0xa0, 0xb2, 0x21),
				pass: "6162636465666768696a6b6c6d6e6f70",
				iv: "7172737475767778797a7b7c7d7e7f80"
			},
			i = 0;

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				arr = new Uint8Array(xhr.response);

				for (i = 0; i < arr.length; i += 1) {
					response += String.fromCharCode(arr[i]);
				}

				test("decrypt() vs. OpenSSL", function () {
					strictEqual(JES.decrypt(obj, "ascii/text"), response);
				});
			}
		};

		xhr.open("GET", url, true);
		xhr.responseType = "arraybuffer";
		xhr.send(null);
	}("openssl_dec.bin"));
}());