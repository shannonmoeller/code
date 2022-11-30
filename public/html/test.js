/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

import { test } from '/test/test.js';

import { isSafe, raw, encode, html } from './html.js';

test('-- html.js --');

test('should create safe strings', (t) => {
  t.ok(isSafe(html``));
  t.ok(isSafe(raw('')));
  t.ok(isSafe(raw(html``)));
  t.ok(isSafe(raw(raw(''))));
  t.ok(isSafe(raw(encode(''))));
  t.ok(isSafe(encode('')));
  t.ok(isSafe(encode(html``)));
  t.ok(isSafe(encode(raw(''))));
  t.ok(isSafe(encode(encode(''))));

  t.throws(
    () => {
      html``.raw = 'evil';
    },
    /raw|read.?only/,
    'not writable'
  );

  t.throws(
    () => {
      Object.defineProperty(html``, 'raw', {
        value: 'evil',
        writable: true,
      });
    },
    /raw|configurable/,
    'not configurable'
  );
});

test('should interpolate values', (t) => {
  const values = [
    undefined,
    null,
    false,
    true,
    0,
    123,
    { foo: 'bar' },
    '<em>foo</em>',
    raw('<em>foo</em>'),
    encode('<em>foo</em>'),
    encode(raw('<em>foo</em>')),
  ];

  // prettier-ignore
  const actual = html`Hi ${values}`;

  // prettier-ignore
  const expected = `Hi 0123{&quot;foo&quot;:&quot;bar&quot;}&lt;em&gt;foo&lt;/em&gt;<em>foo</em>&lt;em&gt;foo&lt;/em&gt;<em>foo</em>`;

  t.equal(actual.length, expected.length);
  t.equal(String(actual), expected);
});

test('should encode unsafe strings', (t) => {
  t.equal(
    String(encode('<img src="/" onerror="alert(`hi`)" />&nbsp;')),
    '&lt;img src=&quot;/&quot; onerror=&quot;alert(&#96;hi&#96;)&quot; /&gt;&amp;nbsp;',
    'img onerror'
  );

  t.equal(
    String(encode(`<script>alert(this && '"hi"');</script>`)),
    '&lt;script&gt;alert(this &amp;&amp; &#39;&quot;hi&quot;&#39;);&lt;/script&gt;',
    'script tag'
  );
});

test('should enforce type', async (t) => {
  await t.throws(() => encode(), /string/, 'expects value');
  await t.throws(() => encode(1), /string/, 'expects string');

  await t.throws(
    () => {
      html` ${() => {}} `;
    },
    /function/,
    'disallow functions'
  );
});
