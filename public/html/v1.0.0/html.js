const UNSAFE_RX = /[&<>"'`]/g;
const ENTITIES = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'`': '&#96;',
};

class SafeString extends String {
	constructor(value) {
		super(value);
		Object.freeze(this);
	}
}

Object.freeze(SafeString);
Object.freeze(SafeString.prototype);

export function html(strings, ...values) {
	const literals = strings.raw;
	let result = literals[0];

	values.forEach((value, i) => {
		result += serialize(value);
		result += literals[i + 1];
	});

	return raw(result);
}

export function serialize(value) {
	if (isSafe(value)) {
		return value;
	}

	if (Array.isArray(value)) {
		return raw(value.map(serialize).join(''));
	}

	if (value === null || value === undefined) {
		return '';
	}

	switch (typeof value) {
		case 'boolean':
			return '';

		case 'function':
			throw new TypeError(`Unexpected function: ${value}`);

		case 'number':
			value = String(value);
			break;

		case 'object':
			value = JSON.stringify(value);
			break;

		default:
			break;
	}

	return encode(value);
}

export function encode(value) {
	if (isSafe(value)) {
		return value;
	}

	if (typeof value !== 'string') {
		throw new TypeError('Expected a string.');
	}

	return raw(value.replace(UNSAFE_RX, (x) => ENTITIES[x]));
}

export function raw(value) {
	if (isSafe(value)) {
		return value;
	}

	return new SafeString(value);
}

export function isSafe(obj) {
	return obj instanceof SafeString;
}
