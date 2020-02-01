import { Assert } from './assert.js';

const tests = [];

export function test(description, fn) {
	tests.push([description, fn]);
}

export async function run(tests) {
	if (!tests.length) {
		return;
	}

	run: {
		console.log('TAP version 13');

		const assert = new Assert();
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
					break run;
				}
			}
		}

		const endTime = performance.now();

		console.log(`# pass: ${assert.passed}`);
		console.log(`# fail: ${assert.failed}`);
		console.log(`1..${assert.count}`);
		console.log(`# time=${(endTime - startTime).toFixed(2)}ms`);
	}
}

setTimeout(run, 0, tests);
