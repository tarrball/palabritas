class LetterBox extends HTMLElement {
  static placeholderKey = "placeholder";
  static valueKey = "value";

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(LetterBox.template.content.cloneNode(true));

    this.innerSpan = this.shadowRoot.querySelector(".letter");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === LetterBox.valueKey && newValue) {
      this.innerSpan.textContent = newValue;
    } else if (name === LetterBox.placeholderKey && !this.value) {
      this.innerSpan.textContent = newValue;
    } else {
      this.innerSpan.textContent = this.placeholder;
    }
  }

  get placeholder() {
    return this.getAttribute(LetterBox.placeholderKey);
  }
  get value() {
    return this.getAttribute(LetterBox.valueKey);
  }

  set placeholder(value) {
    this.setAttribute(LetterBox.placeholderKey, value);
  }
  set value(value) {
    this.setAttribute(LetterBox.valueKey, value);
  }
}

LetterBox.observedAttributes = [LetterBox.placeholderKey, LetterBox.valueKey];
LetterBox.template = document.createElement("template");
LetterBox.template.innerHTML = `
<style>
    :host {
        user-select: none;
    }

    .letter-container {
        background-color: #333030e8;
        border: black solid 1px;
        cursor: default;
        display: inline-block;
        width: 1em;
    }

    .letter {
        color: white;
        display: inline-block;
        padding-top: .125em;
        text-align: center;
        text-transform: uppercase;
        width: 100%;
    }
</style>
<span class="letter-container">
    <span class="letter"></span>
</span>
`;

export default LetterBox;