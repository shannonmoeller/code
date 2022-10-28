const defaultEvents = ['connect', 'disconnect', 'adopt', 'attributechange'];

export class DhtmlElement extends HTMLElement {
	static attributes = {};
	static events = [];
	static shadowMode = null;

	static get observedAttributes() {
		return Object.keys(this.attributes).map(hyphenate);
	}

	#connection = null;
	#isInitialized = false;

	constructor() {
		super();

		defineAttributes(this, this.constructor.attributes);
		defineEvents(this, [...defaultEvents, ...this.constructor.events]);

		if (this.constructor.shadowMode) {
			this.attachShadow({ mode: this.constructor.shadowMode });
		}
	}

	connectedCallback() {
		if (!this.isConnected) {
			return;
		}

		const connection = new AbortController();
		const { signal } = connection;

		this.#connection?.abort();
		this.#connection = connection;

		if (!this.#isInitialized) {
			this.#isInitialized = true;
			this.init?.();
		}

		this.dispatchEvent(
			new CustomEvent('connect', {
				detail: { signal },
			})
		);
	}

	disconnectedCallback() {
		if (this.isConnected) {
			return;
		}

		this.#connection?.abort();
		this.#connection = null;

		this.dispatchEvent(new CustomEvent('disconnect'));
	}

	adoptedCallback() {
		this.dispatchEvent(new CustomEvent('adopt'));
	}

	attributeChangedCallback(name, oldValue, value) {
		this.dispatchEvent(
			new CustomEvent('attributechange', {
				detail: { name, value, oldValue },
			})
		);
	}
}

export function defineElement(name, init, options = {}) {
	let { attributes, events, ...rest } = options;

	customElements.define(
		name,
		class extends DhtmlElement {
			static attributes = attributes ?? {};
			static events = events ?? [];

			init() {
				init(this);
			}
		},
		rest
	);
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
