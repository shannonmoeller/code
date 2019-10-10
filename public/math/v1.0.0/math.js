export function lerp(value, min, max) {
	return value * (max - min) + min;
}

export function map(value, minA, maxA, minB, maxB) {
	return lerp(norm(value, minA, maxA), minB, maxB);
}

export function norm(value, min, max) {
	return (value - min) / (max - min);
}

export function round(value, multiple = 1) {
	return Math.round(value / multiple) * multiple || 0;
}
