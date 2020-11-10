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

	function handleFrame(now) {
		if (!isPlaying) {
			return;
		}

		let delta = now - prev;
		let ticks = Math.floor(delta / frameRate);

		if (ticks > panicTicks) {
			prev = now - frameRate;
			ticks = 1;
		}

		if (ticks > maxTicks) {
			ticks = maxTicks;
		}

		if (ticks > 0) {
			prev += ticks * frameRate;

			if (update) {
				while (ticks--) {
					update({ now, prev, delta });
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

	function handleFrame(now) {
		if (!isPlaying) {
			return;
		}

		let delta = now - prev;
		prev = now;

		if (update) {
			update({ now, prev, delta });
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
