import { createReducer, on } from '@ngrx/store';
import { GameState, Letter, initialState } from './game.state';
import {
  letterTapped,
  newGameStarted,
  newGameRequested,
  wordSubmitted,
} from './game.actions';
import * as shared from './game.shared';
import { produce } from 'immer';

export const gameReducer = createReducer(
  initialState,
  on(newGameRequested, (state): GameState => state),
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

      if (letter.typedIndex === undefined) {
        letter.typedIndex = calculateNextTypedIndex(draft.scrambledLetters);
      } else {
        letter.typedIndex = undefined;
      }
    })
  ),
  on(wordSubmitted, (state) =>
    produce(state, (draft) => {
      const submittedLetters = shared.getTypedLetters(draft.scrambledLetters);

      const submittedWord = submittedLetters
        .map((letter) => letter.value)
        .join('');

      const matchingAnswer = draft.answers.find(
        (answer) => answer.word === submittedWord
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
    shared
      .getTypedLetters(letters)
      .map((letter) => letter.typedIndex)
      .reverse()[0] ?? -1;

  return lastIndex + 1;
}
