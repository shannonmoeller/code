export function createStore(state) {
	const listeners = new Set();

	return {
		get() {
			return state;
		},

		set(next) {
			state = typeof next === 'function' ? next(state) : next;

			listeners.forEach((listener) => {
				listener(state);
			});
		},

		subscribe(listener, { immediate } = {}) {
			listeners.add(listener);

			if (immediate) {
				listener(state);
			}

			return () => {
				listeners.delete(listener);
			};
		},
	};
}
