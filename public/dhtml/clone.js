export function clone(id) {
  return document.getElementById(id).content.cloneNode(true);
}
