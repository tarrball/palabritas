// @flow

import LetterBox from './letterBox.js';
import GameManager from './gameManager.js';
import { isNullOrUndefined, first, last } from './utils.js';

customElements.define('p-letter-box', LetterBox);

const empty = '_';
const gameManager = new GameManager();
const answerContainer = getDiv('.answers-container');
const game = gameManager.nextGame();

const letters = createLetterBoxArray(
    document.querySelectorAll("[id^='letter-']")
);

const entries = createLetterBoxArray(
    document.querySelectorAll("[id^='entry-']")
);

let answers = [];

function createLetterBoxArray(nodes: NodeList<HTMLElement>): Array<LetterBox> {
    const boxes = Array.from(nodes).map((element) => {
        if (element instanceof LetterBox) {
            return element;
        }

        throw 'Failed to create LetterBox array';
    });

    return boxes;
}

function createLetterBox(): LetterBox {
    const box = document.createElement('p-letter-box');

    if (box instanceof LetterBox) {
        return box;
    }

    throw 'Failed to create LetterBox';
}

Array.from(game.word).forEach((l, i) => {
    letters[i].placeholder = letters[i].value = l;
});

game.subset.forEach((word) => {
    const letterBoxes = Array.from(word).map((letter) => {
        const box = createLetterBox();
        box.placeholder = letter;
        box.value = empty;

        return box;
    });

    const div = document.createElement('div');
    div.classList.add('answer-container');
    div.append(...letterBoxes);

    answerContainer.append(div);

    answers.push({
        container: div,
        isFound: false,
        word,
    });
});

function handleKeyDown(key: string) {
    if (wasBackspacePressed(key)) {
        tryBackspace();
    } else if (wasLetterPressed(key)) {
        trySubmitLetter(key.toLowerCase());
    } else if (wasEnterPressed(key)) {
        trySubmitWord();
    }
}

function wasBackspacePressed(key: string): boolean {
    return key === 'Backspace';
}

function wasEnterPressed(key: string): boolean {
    return key === 'Enter';
}

function wasLetterPressed(key: string): boolean {
    return key.match(/^[a-zA-Z]$/) != null;
}

function tryBackspace() {
    const lastEntry = last(entries.filter((element) => element.value));

    if (!isNullOrUndefined(lastEntry)) {
        const letter = last(
            letters.filter(
                (e) => e.placeholder == lastEntry.value && e.value === empty
            )
        );

        letter.value = letter.placeholder;
        lastEntry.value = '';
    }
}

function trySubmitLetter(key) {
    if (!isLetterAvailable(key)) {
        return;
    }

    const nextEntry = first(entries.filter((e) => !e.value));

    if (!isNullOrUndefined(nextEntry)) {
        const letter = first(
            letters.filter((element) => element.value === key)
        );

        letter.value = empty;
        nextEntry.value = key;
    }
}

function trySubmitWord() {
    input.value = '';

    const entry = entries.map((e) => e.value).join('');
    const answer = answers.find((a) => !a.isFound && a.word === entry);

    if (answer) {
        answer.isFound = true;
        answer.container.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });

        const boxes = getLetterBoxes(answer.container);
        boxes.forEach((b) => (b.value = b.placeholder ?? ''));
        entries.forEach((e) => (e.value = ''));
        letters.forEach((l) => (l.value = l.placeholder ?? ''));
    } else {
        // wrong answer
    }
}

function isLetterAvailable(key) {
    const letter = first(letters.filter((e) => e.value === key));

    return !!letter;
}

function getDiv(selector: string): HTMLDivElement {
    const div = document.querySelector('.answers-container');

    if (div instanceof HTMLDivElement) {
        return div;
    }

    throw `'div' selector '${selector}' not found`;
}

function getInput(selector: string): HTMLInputElement {
    const element = document.querySelector('.hidden-input');

    if (element instanceof HTMLInputElement) {
        return element;
    }

    throw `'input' selector '${selector}' not found`;
}

function getLetterBoxes(container: HTMLDivElement): Array<LetterBox> {
    const boxes = Array.from(container.querySelectorAll('p-letter-box')).map(
        (element) => {
            if (element instanceof LetterBox) {
                return element;
            }

            throw 'Failed to retrieve LetterBox array';
        }
    );

    return boxes;
}

// TODO put this shit somewhere else... this is the input/button thing for mobile

const input = getInput('.hidden-input');
input.value = 'begin';

if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
) {
    input.removeAttribute('hidden');
    input.addEventListener(
        'focus',
        () => {
            input.value = '';
            input.classList.add('hidden');
            document.addEventListener('keydown', (event: KeyboardEvent) =>
                handleKeyDown(event.key)
            );
        },
        { once: true }
    );
} else {
    document.addEventListener('keydown', (event: KeyboardEvent) =>
        handleKeyDown(event.key)
    );
}
