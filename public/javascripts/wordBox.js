// @flow

import CharBox from './charBox.js';

const EMPTY = '_';

class WordBox extends HTMLElement {
    static template: HTMLTemplateElement = document.createElement('template');

    static typeKey: string = 'type';

    static wordKey: string = 'word';

    static observedAttributes: Array<string> = [
        WordBox.typeKey,
        WordBox.wordKey,
    ];

    #charBoxes: Array<CharBox> = [];

    get type(): ?string {
        return this.getAttribute(WordBox.typeKey);
    }

    get word(): ?string {
        return this.getAttribute(WordBox.wordKey);
    }

    set type(value: string) {
        this.setAttribute(WordBox.typeKey, value);
    }

    set word(value: ?string) {
        if (value) {
            this.setAttribute(WordBox.wordKey, value);
        } else {
            const charBoxes = [0, 1, 2, 3, 4, 5].map(() =>
                CharBox.createCharBox(EMPTY)
            );

            this.shadowRoot?.append(...charBoxes);
            this.#charBoxes = charBoxes;
        }
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot?.append(WordBox.template.content.cloneNode(true));
    }

    static createWordBox(word: string, type: string): WordBox {
        const box = document.createElement('p-word-box');

        if (box instanceof WordBox) {
            box.type = type;
            box.word = word;

            return box;
        }

        throw 'Failed to create WordBox';
    }

    static #setCharBoxes(wordBox: WordBox) {
        if (!wordBox.shadowRoot || !wordBox.word) {
            throw 'Failed to set CharBoxes';
        }

        wordBox.shadowRoot.childNodes.forEach((node) =>
            wordBox.shadowRoot?.removeChild(node)
        );

        const isAnswer = wordBox.getAttribute(WordBox.typeKey) === 'answer';

        const charBoxes = Array.from(wordBox.word ?? '').map((char) =>
            isAnswer
                ? CharBox.createCharBox(EMPTY, char, isAnswer)
                : CharBox.createCharBox(char, char)
        );

        wordBox.shadowRoot?.append(...charBoxes);
        wordBox.#charBoxes = charBoxes;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === WordBox.wordKey && newValue) {
            WordBox.#setCharBoxes(this);
        }
    }

    build(): string {
        return this.#charBoxes
            .map((box) => box.value)
            .filter((box) => box !== EMPTY)
            .join('');
    }

    includes(char: string): boolean {
        return this.#charBoxes.filter((box) => box.value === char)[0] != null;
    }

    isEmpty(): boolean {
        return this.#charBoxes.every((box) => box.value === EMPTY);
    }

    pop(): string {
        const matchingBoxes = this.#charBoxes.filter(
            (box) => box.value !== EMPTY
        );

        const lastBox = this.#last(matchingBoxes);
        const value = lastBox.value;

        if (!value) {
            throw 'No value found to pop';
        }

        lastBox.value = EMPTY;

        return value;
    }

    push(key: string) {
        const openBoxes = this.#charBoxes.filter((box) => box.value === EMPTY);

        if (openBoxes.length === 0) {
            throw 'No empty CharBox available';
        }

        const firstOpenBox = this.#first(openBoxes);
        firstOpenBox.value = key;
    }

    reveal() {
        this.#charBoxes.forEach((box) => box.reveal());
    }

    shift(key: string): string {
        const openBoxes = this.#charBoxes.filter((box) => box.value === key);

        if (openBoxes.length === 0) {
            throw `No CharBox found with placeholder '${key}'`;
        }

        const firstOpenBox = this.#first(openBoxes);
        firstOpenBox.value = EMPTY;

        return key;
    }

    unshift(key: string) {
        const matchingBoxes = this.#charBoxes.filter(
            (box) => box.placeholder === key && box.value === EMPTY
        );

        const firstBox = this.#first(matchingBoxes);

        if (!firstBox) {
            throw `No CharBox found with placeholder '${key}'`;
        }

        firstBox.value = key;
    }

    #last(charBoxes: Array<CharBox>): CharBox {
        if (!charBoxes.length) {
            throw 'charBoxes was empty';
        }

        return charBoxes[charBoxes.length - 1];
    }

    #first(charBoxes: Array<CharBox>): CharBox {
        if (!charBoxes.length) {
            throw 'charBoxes was empty';
        }

        return charBoxes[0];
    }
}

WordBox.template.innerHTML = `
<style>
    @import url('stylesheets/wordBox.css');
</style>
`;

export default WordBox;
