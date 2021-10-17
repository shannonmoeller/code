import { test } from '/test/test.js';
import { refs } from './refs.js';

test('-- refs.js --');

test('refs(el)', (t) => {
	const div = document.createElement('div');

	div.innerHTML = `
    <span>before</span>
    <span ref="foo">Foo</span>
    <span ref="bar">Bar</span>
    <span>after</span>
  `;

	const [before, fooChild, barChild, after] = div.children;

	t.equal(fooChild.hasAttribute('ref'), true, 'has ref');
	t.equal(barChild.hasAttribute('ref'), true, 'has ref');

	const { foo, bar } = refs(div);

	t.equal(foo, fooChild, 'same foo');
	t.equal(bar, barChild, 'same bar');

	t.equal(fooChild.hasAttribute('ref'), false, 'removed ref');
	t.equal(barChild.hasAttribute('ref'), false, 'removed ref');
});
