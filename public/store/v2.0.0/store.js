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
			listeners.add(listener);

			if (options.immediate) {
				listener(state);
			}

			return () => {
				listeners.delete(listener);
			};
		},
	};
}
