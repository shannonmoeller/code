export const PRECISION = 1e-6;
export const HALF_PRECISION = PRECISION / 2;

function get(obj, key) {
	if (!obj.has(key)) {
		obj.set(key, new Set());
	}

	return obj.get(key);
}

function set(obj, key, value) {
	get(obj, key).add(value);
}

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

	return abDistance - aRadius - bRadius;
}

export function findClosest(a, b, p) {
	let { x: ax, y: ay } = a;
	let { x: bx, y: by } = b;
	let { x: px, y: py } = p;

	const bax = bx - ax;
	const bay = by - ay;

	const denominator = bax * bax + bay * bay;

	if (!denominator) {
		return p;
	}

	const pax = px - ax;
	const pay = py - ay;

	const numerator = pax * bax + pay * bay;
	const quotient = Math.max(0, Math.min(1, numerator / denominator));

	return {
		x: ax + bax * quotient,
		y: ay + bay * quotient,
	};
}

export function findIntersection(a, b, c, d) {
	let { x: ax, y: ay } = a;
	let { x: bx, y: by } = b;
	let { x: cx, y: cy } = c;
	let { x: dx, y: dy } = d;

	const bax = bx - ax;
	const bay = by - ay;
	const dcx = dx - cx;
	const dcy = dy - cy;

	const denominator = dcy * bax - dcx * bay;

	if (!denominator) {
		return null;
	}

	const acx = ax - cx;
	const acy = ay - cy;

	const baNumerator = bax * acy - bay * acx;
	const baQuotient = baNumerator / denominator;

	if (baQuotient <= 0 || baQuotient >= 1) {
		return null;
	}

	const dcNumerator = dcx * acy - dcy * acx;
	const dcQuotient = dcNumerator / denominator;

	if (dcQuotient <= 0 || dcQuotient >= 1) {
		return null;
	}

	return {
		x: ax + bax * dcQuotient,
		y: ay + bay * dcQuotient,
	};
}

export function findReflection(a, b, p) {
	const { x: px, y: py } = p;
	const { x: cx, y: cy } = findClosest(a, b, p);

	return {
		x: cx + (cx - px),
		y: cy + (cy - py),
	};
}

export function constrain(a, b, options = {}) {
	let { x: ax, y: ay, mass: aMass = 1, radius: aRadius = 0 } = a;
	let { x: bx, y: by, mass: bMass = 1, radius: bRadius = 0 } = b;
	let { length = 0, strength = 1, adjust } = options;

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
	let abDelta = abDistance - aRadius - bRadius - length;

	if (adjust) {
		abDelta = adjust(abDelta);
	}

	if (!abDelta) {
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

export function constrainSeries(particles, options) {
	let max = particles.length - 1;

	for (let i = 0; i < max; i++) {
		let a = particles[i];
		let b = particles[i + 1];

		constrain(a, b, options);
	}
}

function adjustBall(delta) {
	return isMoreThanZero(delta) ? 0 : delta;
}

export function constrainBall(a, b, options) {
	constrain(a, b, { adjust: adjustBall, ...options });
}

export function constrainBalls(particles, options) {
	constrainAll(particles, { adjust: adjustBall, ...options });
}

function adjustChain(delta) {
	return isLessThanZero(delta) ? 0 : delta;
}

export function constrainChain(a, b, options) {
	constrain(a, b, { adjust: adjustChain, ...options });
}

export function constrainChains(particles, options) {
	constrainSeries(particles, { adjust: adjustChain, ...options });
}

function adjustStick(delta) {
	return isZero(delta) ? 0 : delta;
}

export function constrainStick(a, b, options) {
	constrain(a, b, { adjust: adjustStick, ...options });
}

export function constrainSticks(particles, options) {
	constrainSeries(particles, { adjust: adjustStick, ...options });
}
