import { test } from '/test/v1.0.0/test.js';
import { createStore } from './store.js';

test('-- store.js --');

test('createStore(value)', async (t) => {
	const store = createStore();

	t.equal(store.hasOwnProperty('get'), true);
	t.equal(store.hasOwnProperty('set'), true);
	t.equal(store.hasOwnProperty('subscribe'), true);
});

test('store.get()', async (t) => {
	const a = createStore(0);
	const b = createStore({});

	t.equal(a.get(), 0);
	t.deepEqual(b.get(), {});
});

test('store.set(value)', async (t) => {
	const a = createStore(0);
	const b = createStore({ foo: 1 });

	a.set(1);
	b.set({ foo: 2 });

	t.equal(a.get(), 1);
	t.deepEqual(b.get(), { foo: 2 });
});

test('store.set(fn)', async (t) => {
	const a = createStore(0);
	const b = createStore({ foo: 1 });

	a.set((x) => x + 1);
	b.set((x) => ({ ...x, bar: 2 }));

	t.equal(a.get(), 1);
	t.deepEqual(b.get(), { foo: 1, bar: 2 });
});

test('store.subscribe(fn)', async (t) => {
	const a = createStore(0);
	let count = 0;

	a.subscribe((x) => {
		t.equal(a.get(), x);
		++count;
	});

	t.equal(count, 1);

	a.set(1);

	t.equal(count, 2);

	a.set(2);

	t.equal(count, 3);
	t.equal(a.get(), 2);
});

test('store.unsubscribe()', async (t) => {
	const a = createStore(0);
	let count = 0;

	const unsubscribe = a.subscribe((x) => {
		t.equal(a.get(), x);
		++count;
	});

	t.equal(count, 1);

	a.set(1);

	t.equal(count, 2);

	unsubscribe();
	a.set(2);

	t.equal(count, 2);
	t.equal(a.get(), 2);
});
