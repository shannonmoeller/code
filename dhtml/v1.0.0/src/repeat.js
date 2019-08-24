const keyProp = Symbol('com.npmjs.dhtml.repeat.key');

const repeatDefaults = {
  update: () => {},
  key: 'key'
};

export function getKeyedChildNodes(parent) {
  const keyedNodes = {};

  let node = parent.firstChild;

  while (node) {
    keyedNodes[node[keyProp]] = node;
    node = node.nextSibling;
  }

  return keyedNodes;
}

export function repeat(options) {
  const { parent, items, create, update, key } = {
    ...repeatDefaults,
    ...options
  };

  const getKey = typeof key === 'function' ? key : item => item[key];
  const keyedNodes = getKeyedChildNodes(parent);

  let prevNode = null;

  items.forEach(item => {
    const key = getKey(item);
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
