import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

/*
 reference:
 - MDN <dialog />: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 - https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforetoggle_event
 - https://frontendmasters.com/blog/the-dialog-element-with-entry-and-exit-animations/
 */

const defaults = {};
const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = [];
const custumEvents = {
  close: 'msc-dialogs-close',
  toggle: 'msc-dialogs-toggle',
  beforetoggle: 'msc-dialogs-beforetoggle'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host {
  position: relative;
  display: block;
}

:host([data-hide-close-button]) {
  .dialogs .dialogs__content__close {
    display: none;
  }
}

.main {
  position: relative;
  outline: 0 none;
}

.dialogs {
  --backdrop-background-color: var(--msc-dialogs-backdrop-background-color, rgba(35 42 49/.6));
  --border-radius: var(--msc-dialogs-border-radius, 12px);
  --background-color: var(--msc-dialogs-background-color, rgba(255 255 255));
  --margin: var(--msc-dialogs-margin, 24px);
  --padding: var(--msc-dialogs-padding, 24px);
  
  --button-size: var(--msc-dialogs-button-size, 40);
  --button-size-with-unit: calc(var(--button-size) * 1px);
  --button-icon-scale-basis: calc((var(--button-size) * .6) / 24);
  --button-inset-inline-end: var(--msc-dialogs-button-inset-inline-end, 8px);
  --button-inset-block-start: var(--msc-dialogs-button-inset-block-start, 8px);
  --button-icon-color: var(--msc-dialogs-button-icon-color, rgba(95 99 104));
  --button-hover-normal: var(--msc-dialogs-button-normal-background-color, transparent);
  --button-hover-active: var(--msc-dialogs-button-active-background-color, rgba(245, 248, 250));
  --button-hover: var(--button-hover-active);
  --button-active-scale: var(--msc-dialogs-button-active-scale, .8);

  --max-inline-size: calc(100dvi - var(--margin) * 2 - var(--padding) * 2);
  --max-block-size: calc(100dvb - var(--margin) * 2 - var(--padding) * 2);

  background-color: var(--background-color);
  border: 0 none;
  border-radius: var(--border-radius);
  padding: var(--padding);
  box-shadow: 0 0 2px rgba(0 0 0/.05);
  outline: 0 none;
  appearance: none;

  .dialogs__content {
    max-inline-size: var(--max-inline-size);
    max-block-size: var(--max-block-size);
    display: block;

    .dialogs__content__slot {
      inline-size: fit-content;
      display: block;
    }
  }

  .dialogs__content__close {
    font-size: 0;
    appearance: none;
    border: 0 none;
    outline: 0 none;
    padding: 0;
    margin: 0;
    color: transparent;
    display: grid;
    place-content: center;

    position: absolute;
    inset-inline-end: var(--button-inset-inline-end);
    inset-block-start: var(--button-inset-block-start);
    inline-size: var(--button-size-with-unit);
    aspect-ratio: 1/1;
    border-radius: var(--button-size-with-unit);
    background: var(--button-hover);
    transition: background-color 200ms ease;
    will-change: background-color;
    overflow: hidden;
    z-index: 1;

    &:active {
      --button-hover: var(--button-hover-active);

      scale: var(--button-active-scale);
    }

    &:focus {
      --button-hover: var(--button-hover-active);
    }

    @media (hover: hover) {
      --button-hover: var(--button-hover-normal);

      &:hover {
        --button-hover: var(--button-hover-active);
      }
    }

    &::before {
      content: '';
      inline-size: 24px;
      aspect-ratio: 1/1;
      display: block;
      background-color: var(--button-icon-color);
      clip-path: path('M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z');
      scale: var(--button-icon-scale-basis);
    }
  }

  &::backdrop {
    background-color: var(--backdrop-background-color);
  }

  &[open] {
    translate: 0 0;
    opacity: 1;

    @starting-style {
      translate: 0 15%;
      opacity: 0;
    }
  }

  position: fixed;
  inset: 0;
  margin: auto;
  translate: 0 -30%;
  opacity: 0;
  z-index: 2147483647;
  will-change: translate,opacity,overlay,display;

  transition: 
    translate 400ms cubic-bezier(.4,0,.2,1), 
    opacity 400ms cubic-bezier(.4,0,.2,1),
    overlay 250ms cubic-bezier(.4,0,.2,1) allow-discrete,
    display 400ms cubic-bezier(.4,0,.2,1) allow-discrete;

  @media screen and (max-width: 767px) {
    --margin: 0px;

    max-inline-size: 100dvi;
    border-end-start-radius: 0;
    border-end-end-radius: 0;

    .dialogs__content {
      inline-size: var(--max-inline-size);
      max-inline-size: var(--max-inline-size);
      max-block-size: calc(90dvb - var(--margin) * 2 - var(--padding) * 2);

      .dialogs__content__slot {
        inline-size: 100%;
      }
    }

    &[open] {
      /* for safari */
      inset-block: auto 0;

      translate: 0 0;
      opacity: 1;

      @starting-style {
        translate: 0 100%;
        opacity: 0;
      }
    }

    inset-block: auto 0;
    translate: 0 100%;

    /* for safari */
    &:not([open]) {
      inset-block: auto 0;
      translate: 0 100%;
    }
  }
}
</style>

<div class="main" ontouchstart="" tabindex="0">
  <dialog class="dialogs">
    <div class="dialogs__content">
      <button type="button" class="dialogs__content__close">
        close
      </button>

      <slot class="dialogs__content__slot"></slot>
    </div>
  </dialog>
</div>
`;

/*
 Houdini Props and Vals
 - https://web.dev/at-property/
 - https://drafts.css-houdini.org/css-properties-values-api/#syntax-strings
 */
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-dialogs-backdrop-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49/.6)'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-border-radius',
      syntax: '<length>',
      inherits: true,
      initialValue: '12px'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-margin',
      syntax: '<length>',
      inherits: true,
      initialValue: '24px'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-padding',
      syntax: '<length>',
      inherits: true,
      initialValue: '24px'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-button-size',
      syntax: '<number>',
      inherits: true,
      initialValue: '40'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-button-inset-inline-end',
      syntax: '<length>',
      inherits: true,
      initialValue: '8px'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-button-inset-block-start',
      syntax: '<length>',
      inherits: true,
      initialValue: '8px'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-button-icon-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(95 99 104)'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-button-normal-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'transparent'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-button-active-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(245 248 250)'
    });

    CSS.registerProperty({
      name: '--msc-dialogs-button-active-scale',
      syntax: '<number>',
      inherits: true,
      initialValue: '.8'
    });
  } catch(err) {
    console.warn(`msc-dialogs: ${err.message}`);
  }
}

export class MscDialogs extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      dialog: this.shadowRoot.querySelector('.dialogs'),
      btnClose: this.shadowRoot.querySelector('.dialogs__content__close')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscDialogs(config)
    };

    // evts
    this._onClose = this._onClose.bind(this);
    this._onBeforetoggle = this._onBeforetoggle.bind(this);
    this._onToggle = this._onToggle.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);
   const { btnClose, dialog } = this.#nodes;

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;

    dialog.addEventListener('close', this._onClose, { signal });
    dialog.addEventListener('beforetoggle', this._onBeforetoggle, { signal });
    dialog.addEventListener('toggle', this._onToggle, { signal });
    btnClose.addEventListener('click', this._onClick, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscDialogs.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscDialogs.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  get open() {
    return this.#nodes.dialog.open;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _onBeforetoggle(event) {
    const { newState, oldState } = event;

    this.#fireEvent(custumEvents.beforetoggle,
      {
        newState,
        oldState,
        preventDefault: () => {
          event.preventDefault();
        }
      }
    );
  }

  _onToggle(event) {
    const { newState, oldState } = event;

    this.#fireEvent(custumEvents.toggle, { newState, oldState });
  }

  _onClose() {
    this.#fireEvent(custumEvents.close);
  }

  _onClick() {
    if (this.open) {
      this.#nodes.dialog.close();
    }
  }

  close() {
    this.#nodes.btnClose.click();
  }

  showModal() {
    this.#nodes.dialog.showModal();
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscDialogs');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscDialogs'), MscDialogs);
}