/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

import { createStore } from './store.js';

export function createFileStore(initialState, options = {}) {
  const { encode = JSON.stringify, decode = JSON.parse, ...rest } = options;

  let handle;

  const store = {
    ...createStore(initialState),

    async open(asNew = false) {
      if (asNew || !handle) {
        [handle] = await window.showOpenFilePicker({
          multiple: false,
          ...rest,
        });
      }

      const readable = await handle.getFile();

      store.set(decode(await readable.text()));
    },

    async save(asNew = false) {
      if (asNew || !handle) {
        handle = await window.showSaveFilePicker({
          excludeAcceptAllOption: true,
          ...rest,
        });
      }

      const writable = await handle.createWritable();

      await writable.write(encode(store.get()));
      await writable.close();
    },
  };

  return store;
}
