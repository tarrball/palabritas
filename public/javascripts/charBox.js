// @flow

class CharBox extends HTMLElement {
    static template: HTMLTemplateElement = document.createElement('template');

    static placeholderKey: string = 'placeholder';

    static valueKey: string = 'value';

    static observedAttributes: Array<string> = [
        CharBox.placeholderKey,
        CharBox.valueKey,
    ];

    charContainer: HTMLSpanElement;

    innerChar: HTMLSpanElement;

    get placeholder(): ?string {
        return this.getAttribute(CharBox.placeholderKey);
    }

    get value(): ?string {
        return this.getAttribute(CharBox.valueKey);
    }

    set placeholder(value: string) {
        this.setAttribute(CharBox.placeholderKey, value);
    }

    set value(value: string) {
        this.setAttribute(CharBox.valueKey, value);
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot?.append(CharBox.template.content.cloneNode(true));

        const charContainer =
            this.shadowRoot?.querySelector('.char-container') ?? null;
        const innerChar = this.shadowRoot?.querySelector('.char') ?? null;

        if (
            !(charContainer instanceof HTMLSpanElement) ||
            !(innerChar instanceof HTMLSpanElement)
        ) {
            throw `Failed to create 'CharBox'`;
        }

        this.charContainer = charContainer;
        this.innerChar = innerChar;
    }

    static createCharBox(
        char: string,
        placeholder: ?string,
        isAnswer: boolean = false
    ): CharBox {
        const box = document.createElement('p-char-box');

        if (box instanceof CharBox) {
            box.value = char;

            if (placeholder) {
                box.placeholder = placeholder;
            }

            if (isAnswer) {
                box.charContainer.classList.add('answer');
            }

            return box;
        }

        throw 'Failed to create CharBox';
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === CharBox.valueKey) {
            this.innerChar.textContent = newValue;
        }
    }

    reveal() {
        if (!this.placeholder) {
            throw 'Tried to reveal a CharBox without a placeholder';
        }

        this.value = this.placeholder;
    }
}

CharBox.template.innerHTML = `
<style>
    @import url('stylesheets/charBox.css');
</style>
<span class="char-container">
    <span class="char"></span>
</span>
`;

export default CharBox;
