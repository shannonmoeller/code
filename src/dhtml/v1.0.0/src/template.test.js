import { test } from '/test/v1.0.0/test.js';
import { createFragment, html, svg } from './template.js';

test('-- template.js --');

test('createFragment()', async (t) => {
	const foo = () => createFragment`<span></span>`;
	const a = foo();
	const b = foo();

	t.equal(a, b);
	t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
});

test('html()', async (t) => {
	// prettier-ignore
	const template = html`<span></span>`;
	const a = template();
	const b = template();

	t.equal(typeof template, 'function');

	t.notEqual(a, b);

	t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
	t.equal(a.childNodes[0].tagName, 'SPAN');

	t.equal(b.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
	t.equal(b.childNodes[0].tagName, 'SPAN');
});

test('svg()', async (t) => {
	const template = svg`<g></g>`;
	const a = template();
	const b = template();

	t.equal(typeof template, 'function');

	t.notEqual(a, b);

	t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
	t.equal(a.childNodes[0].tagName, 'G');

	t.equal(b.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
	t.equal(b.childNodes[0].tagName, 'G');
});
