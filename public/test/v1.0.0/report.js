const { log } = console;
const pre = document.createElement('pre');

function toString(x) {
	return !['number', 'string'].includes(typeof x)
		? JSON.stringify(x, null, 2)
		: x;
}

document.body.append(pre);

console.log = (...args) => {
	pre.append(...args.map(toString), '\n');
	log(...args);
};
