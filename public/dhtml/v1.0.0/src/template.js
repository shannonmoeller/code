const fragmentCache = new WeakMap();

export function clone(id) {
	return document.getElementById(id).content.cloneNode(true);
}

export function createFragment(strings) {
	if (fragmentCache.has(strings)) {
		return fragmentCache.get(strings);
	}

	const template = document.createElement('template');

	template.innerHTML = strings.join('');

	const { content } = template;

	fragmentCache.set(strings, content);

	return content;
}

export function createTemplate(strings) {
	const content = createFragment(strings);

	return () => content.cloneNode(true);
}

export { createTemplate as html, createTemplate as svg };
