import { test } from '/test/v1.0.0/test.js';

import { clamp, lerp, map, norm, round, createRandom } from './math.js';

test('-- math.js --');

test('clamp(number, number, number)', async (t) => {
	t.equal(clamp(-1, 0, 10), 0);
	t.equal(clamp(0, 0, 10), 0);
	t.equal(clamp(5, 0, 10), 5);
	t.equal(clamp(10, 0, 10), 10);
	t.equal(clamp(11, 0, 10), 10);
});

test('lerp(number, number, number)', async (t) => {
	t.equal(lerp(0, 0, 10), 0);
	t.equal(lerp(0.3, 0, 10), 3);
	t.equal(lerp(0.5, 0, 10), 5);
	t.equal(lerp(0.7, 0, 10), 7);
	t.equal(lerp(1, 0, 10), 10);
	t.equal(lerp(0.5, 0, 100), 50);
	t.equal(lerp(0.5, -100, 0), -50);
	t.equal(lerp(0.5, 2, 4), 3);
});

test('map(number, number, number, number, number)', async (t) => {
	t.equal(map(0, 0, 10, 0, 100), 0);
	t.equal(map(3, 0, 10, 0, 100), 30);
	t.equal(map(5, 0, 10, 0, 100), 50);
	t.equal(map(7, 0, 10, 0, 100), 70);
	t.equal(map(10, 0, 10, 0, 100), 100);
	t.equal(map(5, 0, 10, -100, 0), -50);
	t.equal(map(3, 2, 4, -5, 5), 0);
	t.equal(map(0, -5, 5, 2, 4), 3);
});

test('norm(number, number, number)', async (t) => {
	t.equal(norm(0, 0, 10), 0);
	t.equal(norm(3, 0, 10), 0.3);
	t.equal(norm(5, 0, 10), 0.5);
	t.equal(norm(7, 0, 10), 0.7);
	t.equal(norm(10, 0, 10), 1);
	t.equal(norm(50, 0, 100), 0.5);
	t.equal(norm(-50, -100, 0), 0.5);
	t.equal(norm(3, 2, 4), 0.5);
});

test('round(number, ?number)', async (t) => {
	t.equal(round(0.2), 0);
	t.equal(round(0.3), 0);
	t.equal(round(0.5), 1);
	t.equal(round(0.7), 1);
	t.equal(round(0.8), 1);

	t.equal(round(0, 0), 0);
	t.equal(round(0, 10), 0);
	t.equal(round(3, 10), 0);
	t.equal(round(5, 10), 10);
	t.equal(round(7, 10), 10);
	t.equal(round(10, 10), 10);

	t.equal(round(0.2, 0.5), 0);
	t.equal(round(0.3, 0.5), 0.5);
	t.equal(round(0.7, 0.5), 0.5);
	t.equal(round(0.8, 0.5), 1);

	// 0.8999999999999999 because IEEE 754
	t.equal(round(1, 0.3), 0.3 * 3);
});

test('createRandom(number)', async (t) => {
	const a = createRandom(1);
	const a1 = a();
	const a2 = a();

	t.ok(a1 >= 0 && a1 < 1);
	t.ok(a2 >= 0 && a2 < 1);
	t.notEqual(a1, a2);

	const b = createRandom(1);
	const b1 = b();
	const b2 = b();

	t.ok(b1 >= 0 && b1 < 1);
	t.ok(b2 >= 0 && b2 < 1);
	t.notEqual(b1, b2);

	const c = createRandom(2);
	const c1 = c();
	const c2 = c();

	t.ok(c1 >= 0 && c1 < 1);
	t.ok(c2 >= 0 && c2 < 1);
	t.notEqual(c1, c2);

	t.equal(a1, b1);
	t.equal(a2, b2);
	t.notEqual(a1, c1);
	t.notEqual(a2, c2);
});
