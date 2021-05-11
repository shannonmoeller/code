const connection = Symbol('connection');
const isInitialized = Symbol('isInitialized');
const events = ['connect', 'disconnect', 'adopt', 'attributechange'];

export function defineElement(name, init, options = {}) {
	let { attributes = {}, base = HTMLElement, ...rest } = options;

	class CustomElement extends base {
		static get observedAttributes() {
			return Object.keys(attributes).map(hyphenate);
		}

		constructor() {
			super();

			defineAttributes(this, attributes);
			defineEvents(this, events);
		}

		connectedCallback() {
			if (!this.isConnected) {
				return;
			}

			const controller = new AbortController();
			const { signal } = controller;

			this[connection]?.abort();
			this[connection] = controller;

			if (!this[isInitialized]) {
				this[isInitialized] = true;
				init(this, { signal });
			}

			emit(this, 'connect', { signal });
		}

		disconnectedCallback() {
			if (this.isConnected) {
				return;
			}

			const controller = this[connection];
			const { signal } = controller;

			controller.abort();
			this[connection] = null;

			emit(this, 'disconnect', { signal });
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
