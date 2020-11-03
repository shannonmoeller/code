import { test } from '/test/v1.0.0/test.js';

import {
	defineElement,
	defineAttribute,
	defineEvent,
	hyphenate,
	emit,
} from './define.js';

test('-- define.js --');

test('hyphenate(str)', async (t) => {
	t.equal(hyphenate('foo'), 'foo');
	t.equal(hyphenate('fooBar'), 'foo-bar');
	t.equal(hyphenate('FooBar'), '-foo-bar');
	t.equal(hyphenate('foo-bar'), 'foo-bar');
});

// test('normalizeAttribute([str, obj])', async (t) => {
// 	t.deepEqual(normalizeAttribute(['foo', {}]), {
// 		name: 'foo',
// 		attr: 'foo',
// 		get: String,
// 		set: String,
// 	});
//
// 	t.deepEqual(normalizeAttribute(['fooBar', {}]), {
// 		name: 'fooBar',
// 		attr: 'foo-bar',
// 		get: String,
// 		set: String,
// 	});
//
// 	t.deepEqual(
// 		normalizeAttribute([
// 			'fooBar',
// 			{
// 				attr: 'bar-foo',
// 				get: JSON.parse,
// 				set: JSON.stringify,
// 			},
// 		]),
// 		{
// 			name: 'fooBar',
// 			attr: 'bar-foo',
// 			get: JSON.parse,
// 			set: JSON.stringify,
// 		}
// 	);
// });
//
// test('reflectAttribute(obj)', async (t) => {
// 	const node = document.createElement('div');
//
// 	reflectAttribute(node, {
// 		name: 'fooBar',
// 		attr: 'bar-foo',
// 		get: Boolean,
// 		set: String,
// 	});
//
// 	reflectAttribute(node, {
// 		name: 'bazBat',
// 		attr: 'bat-baz',
// 		get: JSON.parse,
// 		set: JSON.stringify,
// 	});
//
// 	node.fooBar = true;
// 	t.equal(node.fooBar, true);
// 	t.equal(node.hasAttribute('bar-foo'), true);
//
// 	node.fooBar = false;
// 	t.equal(node.fooBar, false);
// 	t.equal(node.hasAttribute('bar-foo'), false);
//
// 	node.bazBat = { baz: 'bat' };
// 	t.deepEqual(node.bazBat, { baz: 'bat' });
// 	t.deepEqual(node.getAttribute('bat-baz'), '{"baz":"bat"}');
// });

test('defineElement(str, fn[, obj])', async (t) => {
	function FooBar(ref) {
		t.equal(el, ref, 'same element');

		ref.onattributechange = () => t.ok(true, 'attribute changed');
		ref.onconnect = () => t.ok(true, 'connected');
		ref.ondisconnect = () => t.ok(true, 'disconnected');
	}

	const FooBarElement = defineElement('foo-bar', FooBar, {
		attributes: {
			baz: Boolean,
		},
	});

	t.equal(HTMLElement.isPrototypeOf(FooBarElement), true, 'is class');

	const el = document.createElement('foo-bar');

	document.body.append(el);
	t.equal(el.tagName, 'FOO-BAR');

	t.equal(el.baz, false);
	el.baz = true;
	t.equal(el.baz, true);

	el.remove();
});
