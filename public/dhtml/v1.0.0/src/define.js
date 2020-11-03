const isInitialized = Symbol('initialized');
const events = ['connect', 'disconnect', 'adopt', 'attributechange'];

export function defineElement(name, init, options = {}) {
	let { attributes = {}, ...rest } = options;

	class CustomElement extends HTMLElement {
		static get observedAttributes() {
			return Object.keys(attributes).map(hyphenate);
		}

		constructor() {
			super();
			defineAttributes(this, attributes);
			defineEvents(this, events);
		}

		async connectedCallback() {
			if (!this.isConnected) {
				return;
			}

			if (!this[isInitialized]) {
				this[isInitialized] = true;
				await init(this);
			}

			emit(this, 'connect');
		}

		disconnectedCallback() {
			emit(this, 'disconnect');
		}

		adoptedCallback() {
			emit(this, 'adopt');
		}

		attributeChangedCallback(name, oldValue, value) {
			emit(this, 'attributechange', { name, value, oldValue });
		}
	}

	customElements.define(name, CustomElement, rest);

	return CustomElement;
}

export function defineAttributes(element, attributes = {}) {
	for (let [property, descriptor] of Object.entries(attributes)) {
		defineAttribute(element, property, descriptor);
	}
}

export function defineAttribute(element, property, descriptor = {}) {
	if (typeof descriptor === 'function') {
		descriptor = { get: descriptor, set: String };
	}

	if (descriptor === JSON) {
		descriptor = { get: JSON.parse, set: JSON.stringify };
	}

	let attribute = hyphenate(property);
	let { get, set, ...rest } = descriptor;

	if (get) {
		if (get === Boolean) {
			rest.get = () => {
				return element.hasAttribute(attribute);
			};
		} else {
			rest.get = () => {
				return get(element.getAttribute(attribute));
			};
		}
	}

	if (set) {
		if (get === Boolean) {
			rest.set = (value) => {
				element.toggleAttribute(attribute, value);
			};
		} else {
			rest.set = (value) => {
				element.setAttribute(attribute, set(value));
			};
		}
	}

	return Object.defineProperty(element, property, rest);
}

export function hyphenate(string) {
	return string.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`);
}

export function defineEvents(element, events = []) {
	for (let event of events) {
		defineEvent(element, event);
	}
}

export function defineEvent(element, event) {
	let callback;

	return Object.defineProperty(element, `on${event}`, {
		get: () => {
			return callback;
		},

		set: (value) => {
			element.removeEventListener(event, callback);
			element.addEventListener(event, value);
			callback = value;
		},
	});
}

export function emit(emitter, name, detail) {
	return emitter.dispatchEvent(new CustomEvent(name, { detail }));
}
