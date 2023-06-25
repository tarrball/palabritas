import { createReducer, on } from '@ngrx/store';
import { Letter, initialState } from './game.state';
import {
  letterTapped,
  newGameStarted,
  newGameRequested,
  wordSubmitted,
} from './game.actions';
import { produce } from 'immer';

export const gameReducer = createReducer(
  initialState,
  on(newGameRequested, (state) => state),
  on(newGameStarted, (state, { word, answers }) =>
    produce(state, (draft) => {
      draft.answers = answers.map((answer) => ({
        word: answer,
        letters: Array.from(answer),
        isFound: false,
      }));

      draft.scrambledLetters = Array.from(word).map((letter, index) => ({
        value: letter,
        index,
        typedIndex: undefined,
      }));
    })
  ),
  on(letterTapped, (state, { index }) =>
    produce(state, (draft) => {
      const letter = draft.scrambledLetters[index];

      letter.typedIndex =
        letter.typedIndex !== undefined
          ? undefined
          : calculateNextTypedIndex(draft.scrambledLetters);
    })
  ),
  on(wordSubmitted, (state) =>
    produce(state, (draft) => {
      const submittedLetters = draft.scrambledLetters
        .filter((letter) => letter.typedIndex !== undefined)
        .sort((a, b) => a.typedIndex! - b.typedIndex!);

      const submittedWord = submittedLetters
        .map((letter) => letter.value)
        .join('');

      const matchingAnswer = draft.answers.find(
        (answer) => answer.letters.join('') === submittedWord
      );

      if (matchingAnswer) {
        matchingAnswer.isFound = true;
        draft.mostRecentAnswer = submittedWord;
      }

      draft.scrambledLetters.forEach((letter) => {
        letter.typedIndex = undefined;
      });
    })
  )
);

function calculateNextTypedIndex(letters: Letter[]): number {
  const lastIndex =
    letters
      .filter((l) => l.typedIndex !== undefined)
      .map((l) => l.typedIndex!)
      .sort((a, b) => b - a)[0] ?? -1;

  return lastIndex + 1;
}
