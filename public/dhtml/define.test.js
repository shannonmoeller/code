import { test } from '/test/test.js';

import {
  defineElement,
  defineAttribute,
  defineEvent,
  hyphenate,
  emit,
} from './define.js';

const { isPrototypeOf } = Object.prototype;

test('-- define.js --');

test('hyphenate(str)', (t) => {
  t.equal(hyphenate('foo'), 'foo');
  t.equal(hyphenate('fooBar'), 'foo-bar');
  t.equal(hyphenate('FooBar'), '-foo-bar');
  t.equal(hyphenate('foo-bar'), 'foo-bar');
});

test('defineElement(str, fn[, obj])', (t) => {
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

  t.equal(isPrototypeOf.call(HTMLElement, FooBarElement), true, 'is class');

  const el = document.createElement('foo-bar');

  document.body.append(el);
  t.equal(el.tagName, 'FOO-BAR');

  t.equal(el.baz, false);
  el.baz = true;
  t.equal(el.baz, true);

  el.remove();
});

test('defineAttribute(el, str[, obj])', (t) => {
  const el = document.createElement('div');

  defineAttribute(el, 'baz', Boolean);

  t.equal(el.getAttribute('baz'), null);
  t.equal(el.baz, false);

  el.baz = true;
  t.equal(el.getAttribute('baz'), '');
  t.equal(el.baz, true);
});

test('defineEvent(el, str)', async (t) => {
  const el = document.createElement('div');

  defineEvent(el, 'greet');

  await new Promise((resolve) => {
    el.ongreet = (event) => {
      t.equal(event.type, 'greet');
      t.equal(event.target, el);
      resolve();
    };

    emit(el, 'greet');
  });
});
