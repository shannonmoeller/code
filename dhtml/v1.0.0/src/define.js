const isInitializedProp = Symbol('com.npmjs.dhtml.define.isInitialized');

export function hyphenate(value) {
  return value
    .split(/([A-Z]?[a-z]+)/)
    .map(x => x.trim())
    .filter(Boolean)
    .join('-')
    .toLowerCase();
}

export function normalizeAttribute(name, def = {}) {
  const { attr, get, set } = def;

  return {
    name,
    attr: attr || hyphenate(name),
    get: get || String,
    set: set || String
  };
}

export function reflectAttribute(node, def = {}) {
  const { name, attr, get, set } = def;
  const isBoolean = get === Boolean;

  Object.defineProperty(node, name, {
    get: () => isBoolean
      ? node.hasAttribute(attr)
      : get(node.getAttribute(attr)),

    set: value => isBoolean
      ? node.toggleAttribute(attr, value)
      : node.setAttribute(attr, set(value))
  });
}

export function define(tagName, attrs, init) {
  if (arguments.length < 3) {
    init = attrs;
    attrs = {};
  }

  const attrDefs = Object.entries(attrs).map(
    ([name, def]) => normalizeAttribute(name, def)
  );

  const observedAttributes = attrDefs.map(x => x.attr);

  class CustomElement extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes;
    }

    constructor() {
      super();

      attrDefs.forEach(def => {
        reflectAttribute(this, def);
      });
    }

    connectedCallback() {
      if (!this[isInitializedProp]) {
        const children = init(this);

        if (children) {
          if (Array.isArray(children)) {
            this.append(...children);
          } else {
            this.append(children);
          }
        }

        this[isInitializedProp] = true;
      }

      if (this.onconnect) {
        this.onconnect();
      }
    }

    disconnectedCallback() {
      if (this.ondisconnect) {
        this.ondisconnect();
      }
    }

    adoptedCallback() {
      if (this.onadopt) {
        this.onadopt();
      }
    }

    attributeChangedCallback() {
      if (this.onattributechange) {
        this.onattributechange();
      }
    }
  }

  customElements.define(tagName, CustomElement);

  return CustomElement;
}
