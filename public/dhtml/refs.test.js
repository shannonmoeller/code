/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

import { test } from '/test/test.js';
import { refs } from './refs.js';

test('-- refs.js --');

test('refs(el)', (t) => {
  let div = document.createElement('div');

  div.innerHTML = `
    <span>before</span>
    <span ref="foo">Foo</span>
    <span ref="bar">Bar</span>
    <span>after</span>
  `;

  let [before, fooChild, barChild, after] = div.children;

  t.ok(before);
  t.equal(fooChild.hasAttribute('ref'), true, 'has ref');
  t.equal(barChild.hasAttribute('ref'), true, 'has ref');
  t.ok(after);

  let { foo, bar } = refs(div);

  t.equal(foo, fooChild, 'same foo');
  t.equal(bar, barChild, 'same bar');

  t.equal(fooChild.hasAttribute('ref'), false, 'removed ref');
  t.equal(barChild.hasAttribute('ref'), false, 'removed ref');
});
