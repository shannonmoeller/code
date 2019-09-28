/**
 * { x: number, y: number, mass: number }
 */
export function constrain(a, b, length, isResolved) {
	const aMass = a.mass || 0;
	const bMass = b.mass || 0;

	if (aMass === 0 && bMass === 0) {
		return;
	}

	const xDelta = a.x - b.x;
	const yDelta = a.y - b.y;
	const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

	if (isResolved && isResolved(distance)) {
		return;
	}

	const mass = aMass + bMass;
	const scale = (distance - length) / (distance * mass);
	const aScale = scale * aMass;
	const bScale = scale * bMass;

	a.x -= aScale * xDelta;
	a.y -= aScale * yDelta;

	b.x += bScale * xDelta;
	b.y += bScale * yDelta;
}

export function ball(a, b, length) {
	constrain(a, b, length, (d) => d >= length);
}

export function chain(a, b, length) {
	constrain(a, b, length, (d) => d <= length);
}

export function stick(a, b, length) {
	constrain(a, b, length, (d) => d === length);
}
