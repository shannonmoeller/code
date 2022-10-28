export function refs(node) {
  let refs = {};

  node.querySelectorAll('[ref]').forEach((el) => {
    refs[el.getAttribute('ref')] = el;
    el.removeAttribute('ref');
  });

  return refs;
}
