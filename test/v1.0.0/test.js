function typeOf(a) {
  return Object.prototype.toString.call(a).slice(8, -1);
}

function isDeepEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }

  const typeOfA = typeOf(a);
  const typeOfB = typeOf(b);

  if (typeOfA !== typeOfB) {
    return false;
  }

  if (typeOfA === 'Array') {
    return isDeepEqualArray(a, b);
  }

  if (typeOfA === 'Object') {
    return isDeepEqualObject(a, b);
  }

  return false;
}

function isDeepEqualArray(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((x, i) => isDeepEqual(a[i], b[i]));
}

function isDeepEqualObject(a, b) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  
  if (aKeys.join('★') !== bKeys.join('★')) {
    return false;
  }

  return aKeys.every((key) => isDeepEqual(a[key], b[key]));
}

const assert = {
  count: 0,
  passed: 0,
  failed: 0,
  
  comment(message) {
    console.log(`# ${String(message).split('\n').join('\n# ')}`);
  },

  ok(value, message = 'should be ok', ...rest) {
    if (value) {
      assert.passed += 1;
      console.log(`ok ${assert.count += 1} - ${message}`);
    } else {
      assert.failed += 1;
      console.log(`not ok ${assert.count += 1} - ${message}`);
      console.error(...rest);
    }
  },

  equal(a, b, message = 'should be equal') {
    assert.ok(Object.is(a, b), message, { a, b });
  },

  notEqual(a, b, message = 'should not be equal') {
    assert.ok(!Object.is(a, b), message, { a, b });
  },

  deepEqual(a, b, message = 'should be deeply equal') {
    assert.ok(isDeepEqual(a, b), message, { a, b });
  },

  notDeepEqual(a, b, message = 'should not be deeply equal') {
    assert.ok(!isDeepEqual(a, b), message, { a, b });
  },
};

const tests = [];

export function test(description, fn) {
  tests.push([description, fn]);
}

setTimeout(async () => {
  console.log('TAP version 13');

  const startTime = performance.now();

  for (const [description, fn] of tests) {
    if (description) {
      assert.comment(description);
    }

    if (fn) {
      try {
        await fn(assert);
      } catch (e) {
        assert.failed += 1;
        console.error(e);
      }
    }
  }

  const endTime = performance.now();

  console.log(`# pass: ${assert.passed}`);
  console.log(`# fail: ${assert.failed}`);
  console.log(`1..${assert.count}`);
  console.log(`# time=${(endTime - startTime).toFixed(2)}ms`);
});