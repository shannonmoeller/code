import { createAssert } from './assert.js';

const tests = [];

export function test(description, fn) {
	tests.push([description, fn]);
}

export async function run() {
	if (!tests.length) {
		return;
	}

	console.log('TAP version 13');

	const assert = createAssert();
	const startTime = performance.now();

	for (const [description, fn] of tests) {
		if (description) {
			assert.comment(description);
		}

		if (fn) {
			try {
				await fn(assert);
			} catch (e) {
				console.error(e.stack);
				return;
			}
		}
	}

	const endTime = performance.now();

	console.log(`# pass: ${assert.passed}`);
	console.log(`# fail: ${assert.failed}`);
	console.log(`1..${assert.count}`);
	console.log(`# time=${(endTime - startTime).toFixed(2)}ms`);
}

setTimeout(run, 0);
