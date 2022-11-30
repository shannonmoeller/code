/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

export function clone(id) {
  return document.getElementById(id).content.cloneNode(true);
}
