const template = document.createElement("template");

template.innerHTML = /* html */ `
  <style>
    a {
      display: inline-block;
      width: 100%;
      text-align: center;
      padding-block: var(--spacing-150, 0.75rem);
      border-radius: var(--spacing-100, 0.5rem);
      text-decoration: none;
      font-weight: var(--fw-bold);
      background-color: var(--clr-gray-700, #333333);
      color: var(--clr-white, #ffffff);
      transition: background-color 0.3s, color 0.3s;
    }

    a:hover {
      background-color: var(--clr-green, #C4F82A);
      color: var(--clr-gray-700, #333333);
    }
  </style>
  <a target="_blank" rel="noopener noreferrer">
    <slot></slot>
  </a>
`;

class ButtonComponent extends HTMLElement {
  static get observedAttributes() {
    return ["url"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Set default values
    this.defaultUrl = "#";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Update the anchor element when the observed attributes change
    const anchor = this.shadowRoot.querySelector("a");
    if (name === "url") {
      try {
        const url = new URL(newValue, window.location.origin); // Fallback url
        anchor.href = newValue;
      } catch (error) {
        console.warn(
          `Invalid URL provided: "${newValue}". Falling back to default.`
        );
        anchor.href = this.defaultUrl;
      }
    }
  }

  connectedCallback() {
    // Apply default values when the component is added to the DOM
    const anchor = this.shadowRoot.querySelector("a");
    anchor.href = this.getAttribute("url") || this.defaultUrl;

    // Add a click event listener to emit a custom event for analytics, logging, etc.
    anchor.addEventListener("click", (event) => {
      // Prevent default navigation if the href is "#"
      if (anchor.href === "#") {
        event.preventDefault();
      }

      // Emit the custom event
      this.dispatchEvent(
        new CustomEvent("button-clicked", {
          detail: {
            url: anchor.href,
            text: anchor.textContent.trim(),
          },
          bubbles: true, // Allow the event to bubble up the DOM
          composed: true, // Allow the event to cross shadow DOM boundaries
        })
      );
    });
  }
}

customElements.define("button-c", ButtonComponent);
