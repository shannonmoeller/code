export const PRECISION = 1e-6;
export const HALF_PRECISION = PRECISION / 2;

export function imprecision() {
	return Math.random() * PRECISION - HALF_PRECISION;
}

export function isLessThanZero(value) {
	return value < PRECISION;
}

export function isMoreThanZero(value) {
	return value > -PRECISION;
}

export function isZero(value) {
	return Math.abs(value) <= PRECISION;
}

export function getDistance(a, b) {
	let { x: ax, y: ay, radius: aRadius = 0 } = a;
	let { x: bx, y: by, radius: bRadius = 0 } = b;

	let xDelta = ax - bx;
	let yDelta = ay - by;
	let abDistance = Math.hypot(xDelta, yDelta);
	let abRadius = aRadius + bRadius;

	return abDistance - abRadius;
}

export function constrain(a, b, options = {}) {
	let { x: ax, y: ay, mass: aMass = 1, radius: aRadius = 0 } = a;
	let { x: bx, y: by, mass: bMass = 1, radius: bRadius = 0 } = b;
	let { length = 0, strength = 1, isResolved } = options;

	if (isZero(aMass) && isZero(bMass)) {
		return;
	}

	if (ax === bx && ay === by) {
		ax += imprecision();
		ay += imprecision();
		bx += imprecision();
		by += imprecision();
	}

	let xDelta = ax - bx;
	let yDelta = ay - by;
	let abDistance = Math.hypot(xDelta, yDelta);
	let abRadius = length + aRadius + bRadius;
	let abDelta = abDistance - abRadius;

	if (isResolved && isResolved(abDelta)) {
		return;
	}

	let abMass = aMass + bMass;
	let abScale = abDelta / (abDistance * abMass);
	let aScale = abScale * aMass * strength;
	let bScale = abScale * bMass * strength;

	a.x -= xDelta * aScale;
	a.y -= yDelta * aScale;
	b.x += xDelta * bScale;
	b.y += yDelta * bScale;
}

export function constrainAll(particles, options = {}) {
	let cellSize = options.cellSize;
	let cells = new Map();
	let cache = new Map();

	if (!cellSize) {
		cellSize = Math.max(...particles.map((p) => p.radius)) * 2;
	}

	for (let particle of particles) {
		let { x, y, radius } = particle;

		let top = Math.floor((y - radius) / cellSize);
		let bottom = Math.floor((y + radius) / cellSize);
		let left = Math.floor((x - radius) / cellSize);
		let right = Math.floor((x + radius) / cellSize);

		set(cells, `${left},${top}`, particle);
		set(cells, `${left},${bottom}`, particle);
		set(cells, `${right},${top}`, particle);
		set(cells, `${right},${bottom}`, particle);
	}

	for (let cell of cells.values()) {
		let neighbors = [...cell];
		let { length } = neighbors;

		for (let i = 0; i < length; i++) {
			let a = neighbors[i];

			for (let j = i + 1; j < length; j++) {
				let b = neighbors[j];

				if (get(cache, a).has(b)) {
					continue;
				}

				set(cache, a, b);
				set(cache, b, a);

				constrain(a, b, options);
			}
		}
	}
}

function get(obj, key) {
	if (!obj.has(key)) {
		obj.set(key, new Set());
	}

	return obj.get(key);
}

function set(obj, key, value) {
	get(obj, key).add(value);
}

export function constrainSeries(particles, options) {
	let max = particles.length - 1;

	for (let i = 0; i < max; i++) {
		let a = particles[i];
		let b = particles[i + 1];

		constrain(a, b, options);
	}
}

export function constrainBall(a, b, options) {
	constrain(a, b, { isResolved: isMoreThanZero, ...options });
}

export function constrainBalls(particles, options) {
	constrainAll(particles, { isResolved: isMoreThanZero, ...options });
}

export function constrainChain(a, b, options) {
	constrain(a, b, { isResolved: isLessThanZero, ...options });
}

export function constrainChains(particles, options) {
	constrainSeries(particles, { isResolved: isLessThanZero, ...options });
}

export function constrainStick(a, b, options) {
	constrain(a, b, { isResolved: isZero, ...options });
}

export function constrainSticks(particles, options) {
	constrainSeries(particles, { isResolved: isZero, ...options });
}
