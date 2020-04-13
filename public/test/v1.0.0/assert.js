function typeOf(value) {
	return Object.prototype.toString.call(value).slice(8, -1);
}

function isDeepEqual(a, b) {
	if (Object.is(a, b)) {
		return true;
	}

	const typeOfA = typeOf(a);
	const typeOfB = typeOf(b);

	if (typeOfA !== typeOfB) {
		return false;
	}

	if (typeOfA === 'Date') {
		return Number(a) === Number(b);
	}

	if (typeOfA.endsWith('Array') || typeOfA === 'Set') {
		return isDeepEqualArray(Array.from(a), Array.from(b));
	}

	if (typeOfA === 'Map') {
		return isDeepEqualMap(a, b);
	}

	if (typeOfA === 'Object') {
		return isDeepEqualObject(a, b);
	}

	return false;
}

function isDeepEqualArray(a, b) {
	if (a.length !== b.length) {
		return false;
	}

	return a.every((x, i) => isDeepEqual(a[i], b[i]));
}

function isDeepEqualMap(a, b) {
	const aEntries = a.entries();
	const bEntries = b.entries();
	const aKeys = aEntries.map((x) => x[0]).sort();
	const bKeys = bEntries.map((x) => x[0]).sort();

	if (aKeys.join('★') !== bKeys.join('★')) {
		return false;
	}

	return aKeys.every((key) => isDeepEqual(a.get(key), b.get(key)));
}

function isDeepEqualObject(a, b) {
	const aKeys = Object.keys(a).sort();
	const bKeys = Object.keys(b).sort();

	if (aKeys.join('★') !== bKeys.join('★')) {
		return false;
	}

	return aKeys.every((key) => isDeepEqual(a[key], b[key]));
}

export class Assert {
	constructor() {
		this.count = 0;
		this.passed = 0;
		this.failed = 0;
	}

	comment(message) {
		const formatted = String(message)
			.split('\n')
			.join('\n# ');

		console.log(`# ${formatted}`);
	}

	ok(value, message = 'should be ok', ...rest) {
		if (value) {
			this.passed += 1;
			console.log(`ok ${(this.count += 1)} - ${message}`);
		} else {
			this.failed += 1;
			console.log(`not ok ${(this.count += 1)} - ${message}`);

			if (rest.length) {
				console.table(...rest);
			}
		}
	}

	equal(actual, expected, message = 'should be equal') {
		this.ok(Object.is(actual, expected), message, {
			actual,
			expected,
		});
	}

	notEqual(actual, expected, message = 'should not be equal') {
		this.ok(!Object.is(actual, expected), message, {
			actual,
			expected,
		});
	}

	deepEqual(actual, expected, message = 'should be deeply equal') {
		this.ok(isDeepEqual(actual, expected), message, {
			actual,
			expected,
		});
	}

	notDeepEqual(actual, expected, message = 'should not be deeply equal') {
		this.ok(!isDeepEqual(actual, expected), message, {
			actual,
			expected,
		});
	}

	async throws(fn, expected, message = 'should throw') {
		try {
			await fn();
			this.ok(false, message);
		} catch (e) {
			if (expected instanceof RegExp) {
				this.ok(e.message.match(expected), message, {
					actual: e.message,
					expected: String(expected),
				});
			} else {
				this.equal(e.message, expected, message);
			}
		}
	}
}
