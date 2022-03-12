// @flow

class LetterBox extends HTMLElement {
    static template: HTMLTemplateElement = document.createElement('template');

    static placeholderKey: string = 'placeholder';

    static valueKey: string = 'value';

    static observedAttributes: Array<string> = [
        LetterBox.placeholderKey,
        LetterBox.valueKey,
    ];

    innerSpan: HTMLSpanElement;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot?.append(LetterBox.template.content.cloneNode(true));
        const innerSpan = this.shadowRoot?.querySelector('.letter') ?? null;

        if (!(innerSpan instanceof HTMLSpanElement)) {
            throw `Failed to create 'LetterBox'`;
        }

        this.innerSpan = innerSpan;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === LetterBox.valueKey && newValue) {
            this.innerSpan.textContent = newValue;
        } else if (name === LetterBox.placeholderKey && !this.value) {
            this.innerSpan.textContent = newValue;
        } else {
            this.innerSpan.textContent = this.placeholder ?? '';
        }
    }

    get placeholder(): string {
        const attr = this.getAttribute(LetterBox.placeholderKey);

        if (attr) {
            return attr;
        }

        throw `'placeholder' wasn't set`;
    }

    get value(): string {
        const attr = this.getAttribute(LetterBox.valueKey);

        if (attr) {
            return attr;
        }

        throw `'value' wasn't set`;
    }

    set placeholder(value: string) {
        this.setAttribute(LetterBox.placeholderKey, value);
    }
    set value(value: string) {
        this.setAttribute(LetterBox.valueKey, value);
    }
}

LetterBox.template.innerHTML = `
<style>
    @import url('stylesheets/letterBox.css');
</style>
<span class="letter-container">
    <span class="letter"></span>
</span>
`;

export default LetterBox;
