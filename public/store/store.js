export function createStore(state) {
  const listeners = new Set();

  return {
    get() {
      return state;
    },

    set(next) {
      state = typeof next === 'function' ? next(state) : next;

      return Promise.all(
        [...listeners].map(async (listener) => {
          await listener(state);
        })
      );
    },

    subscribe(listener, options = {}) {
      const { immediate = true } = options;

      listeners.add(listener);

      if (immediate) {
        listener(state);
      }

      return () => {
        listeners.delete(listener);
      };
    },

    unsubscribe(listener) {
      listeners.delete(listener);
    },
  };
}
