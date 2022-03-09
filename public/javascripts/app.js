import LetterBox from "./letterBox.js";

customElements.define("p-letter-box", LetterBox);

const EMPTY = "_";
const letters = Array.from(document.querySelectorAll(`[id^='letter-']`));
const entries = Array.from(document.querySelectorAll(`[id^='entry-']`));

Array.from("rescue").forEach((l, i) => {
  letters[i].placeholder = letters[i].value = l;
});

document.addEventListener("keydown", (event) => handleKeyDown(event.key));

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
  return key === "Backspace";
}

function wasEnterPressed(key) {
  return key === "Enter";
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
    lastEntry.removeAttribute(LetterBox.valueKey);
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
  console.log(entries.map((e) => e.value).join(""));
}

function isLetterAvailable(key) {
  const letter = letters.filter((e) => e.value === key).first();

  return !!letter;
}
