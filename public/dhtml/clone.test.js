/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

import { test } from '/test/test.js';
import { clone } from './clone.js';

test('-- clone.js --');

test('clone()', (t) => {
  let template = document.createElement('template');

  template.id = 'foo';
  template.innerHTML = '<span></span>';

  document.body.append(template);

  let a = clone('foo');

  t.equal(a.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
  t.equal(a.childNodes[0].tagName, 'SPAN');

  template.remove();
});
