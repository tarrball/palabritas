import LetterBox from './letterBox.js';
import GameManager from './gameManager.js';

customElements.define('p-letter-box', LetterBox);

const EMPTY = '_';
const letters = Array.from(document.querySelectorAll('[id^=\'letter-\']'));
const entries = Array.from(document.querySelectorAll('[id^=\'entry-\']'));
const answerContainer = document.querySelector('.answers-container');
const gameManager = new GameManager();
const game = gameManager.nextGame();

let answers = [];

Array.from(game.word).forEach((l, i) => {
    letters[i].placeholder = letters[i].value = l;
});

game.subset.forEach((word) => {
    const letterBoxes = Array.from(word).map((letter) => {
        const box = document.createElement('p-letter-box');
        box.placeholder = letter;
        box.value = '_';

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

const input = document.querySelector('.hidden-input');
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
            document.addEventListener('keydown', (event) => handleKeyDown(event.key));
        },
        { once: true }
    );
} else {
    document.addEventListener('keydown', (event) => handleKeyDown(event.key));
}

function handleKeyDown(key) {
    if (wasBackspacePressed(key)) {
        tryBackspace();
    } else if (wasLetterPressed(key)) {
        trySubmitLetter(key.toLowerCase());
    } else if (wasEnterPressed(key)) {
        trySubmitWord();
    }
}

function wasBackspacePressed(key) {
    return key === 'Backspace';
}

function wasEnterPressed(key) {
    return key === 'Enter';
}

function wasLetterPressed(key) {
    return key.match(/^[a-zA-Z]$/);
}

function tryBackspace() {
    const lastEntry = entries.filter((element) => element.value).last();

    if (!isNullOrUndefined(lastEntry)) {
        const letter = letters
            .filter((e) => e.placeholder == lastEntry.value && e.value === EMPTY)
            .last();

        letter.value = letter.placeholder;

        lastEntry.value = '';
    // lastEntry.removeAttribute(LetterBox.valueKey);
    }
}

function trySubmitLetter(key) {
    if (!isLetterAvailable(key)) {
        return;
    }

    const nextEntry = entries.filter((e) => !e.value).first();

    if (!isNullOrUndefined(nextEntry)) {
        const letter = letters.filter((element) => element.value === key).first();

        letter.value = EMPTY;
        nextEntry.value = key;
    }
}

function trySubmitWord() {
    input.value = '';

    const entry = entries.map((e) => e.value).join('');
    const answer = answers.find((a) => !a.isFound && a.word === entry);

    if (answer) {
        answer.isFound = true;
        answer.container.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const boxes = answer.container.querySelectorAll('p-letter-box');
        boxes.forEach((b) => (b.value = b.placeholder));
        entries.forEach((e) => (e.value = ''));
        letters.forEach((l) => (l.value = l.placeholder));
    } else {
    // wrong answer
    }
}

function isLetterAvailable(key) {
    const letter = letters.filter((e) => e.value === key).first();

    return !!letter;
}