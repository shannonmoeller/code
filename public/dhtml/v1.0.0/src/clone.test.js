import { test } from '/test/v1.0.0/test.js';
import { clone } from './clone.js';

test('-- clone.js --');

test('clone()', async (t) => {
	const template = document.createElement('template');

	template.id = 'foo';
	template.innerHTML = '<span></span>';

	document.body.append(template);

	const a = clone('foo');

	t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
	t.equal(a.childNodes[0].tagName, 'SPAN');

	template.remove();
});
