export const DPR = window.devicePixelRatio || 1;

export function createContext(canvas, options = {}) {
	const { type = '2d', ...rest } = options;

	return resizeContext(canvas.getContext(type), rest);
}

export function createViewport(ctx, camera) {
	let { height, width } = ctx;
	let { x = 0, y = 0, z = 1 } = camera;

	let scale = Math.max(0, z);
	let scaledHeight = height / scale;
	let scaledWidth = width / scale;
	let halfScaledHeight = scaledHeight / 2;
	let halfScaledWidth = scaledWidth / 2;

	ctx.save();
	ctx.scale(scale, scale);
	ctx.translate(halfScaledWidth - x, halfScaledHeight - y);

	return {
		height: scaledHeight,
		width: scaledWidth,
		top: y - halfScaledHeight,
		bottom: y + halfScaledHeight,
		left: x - halfScaledWidth,
		right: x + halfScaledWidth,

		restore() {
			ctx.restore();

			return ctx;
		},
	};
}

export function clearContext(ctx) {
	ctx.save();
	ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.restore();

	return ctx;
}

export function fillContext(ctx) {
	ctx.save();
	ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
	ctx.fillRect(0, 0, ctx.width, ctx.height);
	ctx.restore();

	return ctx;
}

export function resizeContext(ctx, options = {}) {
	let { canvas } = ctx;
	let { width, height, quality = 1 } = options;
	let scale = DPR * quality;

	if (width && height) {
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
	} else {
		width = canvas.clientWidth;
		height = canvas.clientHeight;
	}

	canvas.width = width * scale;
	canvas.height = height * scale;

	ctx.width = width;
	ctx.height = height;
	ctx.scale(scale, scale);

	return ctx;
}
