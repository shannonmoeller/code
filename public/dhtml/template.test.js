/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

import { test } from '/test/test.js';
import { createFragment, html, svg } from './template.js';

test('-- template.js --');

test('createFragment()', (t) => {
  let foo = () => createFragment`<span></span>`;
  let a = foo();
  let b = foo();

  t.equal(a, b);
  t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
});

test('html()', (t) => {
  // prettier-ignore
  let template = html`<span></span>`;
  let a = template();
  let b = template();

  t.equal(typeof template, 'function');

  t.notEqual(a, b);

  t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
  t.equal(a.childNodes[0].tagName, 'SPAN');

  t.equal(b.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
  t.equal(b.childNodes[0].tagName, 'SPAN');
});

test('svg()', (t) => {
  let template = svg`<g></g>`;
  let a = template();
  let b = template();

  t.equal(typeof template, 'function');

  t.notEqual(a, b);

  t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
  t.equal(a.childNodes[0].tagName, 'G');

  t.equal(b.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
  t.equal(b.childNodes[0].tagName, 'G');
});
