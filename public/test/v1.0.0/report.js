const { log } = console;
const pre = document.createElement('pre');

function toString(obj) {
	return typeof obj !== 'string' ? JSON.stringify(obj, null, 2) : obj;
}

function reportLog(...args) {
	log(...args);

	setTimeout(() => {
		const text = args.map(toString).join(' ');
		const span = document.createElement('span');

		if (text.startsWith('# ')) {
			span.style.color = 'dodgerblue';
		}

		if (text.startsWith('ok ')) {
			span.style.color = 'seagreen';
		}

		if (text.startsWith('not ok ')) {
			span.style.color = 'deeppink';
		}

		span.textContent = text;
		pre.append(span, '\n');
	});
}

console.log = reportLog;
document.body.append(pre);
