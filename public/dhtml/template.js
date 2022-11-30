/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

let fragmentCache = new WeakMap();

export function createFragment(strings) {
  if (fragmentCache.has(strings)) {
    return fragmentCache.get(strings);
  }

  let template = document.createElement('template');

  template.innerHTML = strings.join('');

  let { content } = template;

  fragmentCache.set(strings, content);

  return content;
}

export function createTemplate(strings) {
  let content = createFragment(strings);

  return () => content.cloneNode(true);
}

export { createTemplate as html, createTemplate as svg };
