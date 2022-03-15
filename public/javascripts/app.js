// @flow

import CharBox from './charBox.js';
import WordBox from './wordBox.js';
import GameManager from './gameManager.js';

customElements.define('p-char-box', CharBox);
customElements.define('p-word-box', WordBox);

const empty = '_';
const gameManager = new GameManager();
const answerContainer = getDiv('.answers-container');
const scoreLabel = getLabel('#score-label');
const nextButton = getButton('#next-button');

// $FlowIgnore
const scrambleBox: WordBox = document.querySelector('#scramble-box');
// $FlowIgnore
const entryBox: WordBox = document.querySelector('#entry-box');

let answers = [];

startNewGame();

function startNewGame() {
    let game = gameManager.nextGame();
    scrambleBox.word = game.word;
    entryBox.word = null;
    answers = [];
    scoreLabel.textContent = '000';

    Array.from(answerContainer.children).forEach((child) =>
        answerContainer.removeChild(child)
    );

    game.subset.forEach((word) => {
        const wordBox = WordBox.createWordBox(word, 'answer');

        answerContainer.append(wordBox);

        answers.push({
            container: wordBox,
            isFound: false,
            word,
        });
    });
}

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
    if (entryBox.isEmpty()) {
        return;
    }

    backspace();
}

function backspace() {
    scrambleBox.unshift(entryBox.pop());
}

function trySubmitLetter(key: string) {
    if (!scrambleBox.includes(key)) {
        return;
    }

    entryBox.push(scrambleBox.shift(key));
}

function trySubmitWord() {
    input.value = '';

    const entry = entryBox.build();
    const answer = answers.find((a) => !a.isFound && a.word === entry);

    if (!answer) {
        // wrong answer buddy
        return;
    }

    answer.isFound = true;
    answer.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    answer.container.reveal();

    updateScore(answer.word);

    while (!entryBox.isEmpty()) {
        backspace();
    }
}

function updateScore(word: string) {
    const score = Number(scoreLabel.textContent);

    scoreLabel.textContent = (score + word.length * 10)
        .toString()
        .padStart(3, '0');
}

function getButton(selector: string): HTMLButtonElement {
    const button = document.querySelector(selector);

    if (button instanceof HTMLButtonElement) {
        return button;
    }

    throw `'button' selector '${selector}' not found`;
}

function getDiv(selector: string): HTMLDivElement {
    const div = document.querySelector(selector);

    if (div instanceof HTMLDivElement) {
        return div;
    }

    throw `'div' selector '${selector}' not found`;
}

function getInput(selector: string): HTMLInputElement {
    const element = document.querySelector(selector);

    if (element instanceof HTMLInputElement) {
        return element;
    }

    throw `'input' selector '${selector}' not found`;
}

function getLabel(selector: string): HTMLLabelElement {
    const label = document.querySelector(selector);

    if (label instanceof HTMLLabelElement) {
        return label;
    }

    throw `'label' selector '${selector}' not found`;
}

function getCharBoxes(container: HTMLDivElement): Array<CharBox> {
    const boxes = Array.from(container.querySelectorAll('p-char-box')).map(
        (element) => {
            if (element instanceof CharBox) {
                return element;
            }

            throw 'Failed to retrieve CharBox array';
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

nextButton.addEventListener('click', () => {
    nextButton.blur();
    startNewGame();
});
