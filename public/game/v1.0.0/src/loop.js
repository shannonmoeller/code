export function createTickLoop(options) {
	let {
		update,
		render,
		hertz = 120,
		panicTicks = 1200,
		maxTicks = 24,
	} = options;

	let frameRate = 1000 / hertz;
	let isPlaying = false;
	let prev = null;

	function handleFrame(next) {
		if (!isPlaying) {
			return;
		}

		let delta = next - prev;
		let ticks = Math.floor(delta / frameRate);

		if (ticks > panicTicks) {
			prev = next - frameRate;
			ticks = 1;
		}

		if (ticks > maxTicks) {
			ticks = maxTicks;
		}

		if (ticks > 0) {
			prev += ticks * frameRate;

			if (update) {
				while (ticks--) {
					update();
				}
			}

			if (render) {
				render();
			}
		}

		requestAnimationFrame(handleFrame);
	}

	return {
		get isPlaying() {
			return isPlaying;
		},

		start() {
			isPlaying = true;
			prev = performance.now();
			requestAnimationFrame(handleFrame);
		},

		stop() {
			isPlaying = false;
		},
	};
}

export function createTimeLoop(options) {
	let { update, render } = options;
	let isPlaying = false;
	let prev = null;

	function handleFrame(next) {
		if (!isPlaying) {
			return;
		}

		let delta = next - prev;
		prev = next;

		if (update) {
			update(delta);
		}

		if (render) {
			render();
		}

		requestAnimationFrame(handleFrame);
	}

	return {
		get isPlaying() {
			return isPlaying;
		},

		start() {
			isPlaying = true;
			prev = performance.now();
			requestAnimationFrame(handleFrame);
		},

		stop() {
			isPlaying = false;
		},
	};
}
