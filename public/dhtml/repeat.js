let keyProp = Symbol('com.npmjs.dhtml.repeat.key');

let repeatDefaults = {
  update: () => {},
  key: 'key',
};

export function empty(node) {
  while (node && node.lastChild) {
    node.lastChild.remove();
  }

  return node;
}

export function getKeyedChildNodes(parent) {
  let keyedNodes = {};

  let node = parent.firstChild;

  while (node) {
    keyedNodes[node[keyProp]] = node;
    node = node.nextSibling;
  }

  return keyedNodes;
}

export function repeat(options) {
  let { parent, items, create, update, key } = {
    ...repeatDefaults,
    ...options,
  };

  if (!items.length && !items.size) {
    return empty(parent);
  }

  let getKey = typeof key === 'function' ? key : (item) => item[key];
  let keyedNodes = getKeyedChildNodes(parent);

  let prevNode = null;

  items.forEach((item) => {
    let key = getKey(item);
    let node = keyedNodes[key];

    if (node) {
      update(node, item);
    } else {
      node = create(item);
    }

    node[keyProp] = key;

    if (prevNode) {
      prevNode.after(node);
    } else {
      parent.prepend(node);
    }

    prevNode = node;
  });

  while (prevNode && prevNode.nextSibling) {
    prevNode.nextSibling.remove();
  }

  return parent;
}
