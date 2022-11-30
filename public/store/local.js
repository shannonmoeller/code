/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

import { createStore } from './store.js';

function getStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    return;
  }
}

export function createLocalStore(key, initialState) {
  const store = createStore(getStorage(key) ?? initialState);

  store.subscribe((state) => {
    setStorage(key, state);
  });

  return store;
}
