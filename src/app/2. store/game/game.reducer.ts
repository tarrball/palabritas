import { createReducer, on } from '@ngrx/store';
import { GameState, Letter, initialState } from './game.state';
import {
  letterTapped,
  newGameStarted,
  newGameRequested,
  wordSubmitted,
  revealGameRequested,
  nextRoundRequested,
  resetGameRequested,
} from './game.actions';
import * as shared from './game.shared';
import { produce } from 'immer';

export const gameReducer = createReducer(
  initialState,
  on(newGameRequested, (state): GameState => state),
  on(resetGameRequested, (): GameState => initialState),
  on(nextRoundRequested, (state): GameState => state),
  on(newGameStarted, (state, { word, answers }) =>
    produce(state, (draft) => {
      const currentRoundPoints = draft.answers
        .filter((answer) => answer.state === 'found')
        .reduce((acc, answer) => acc + answer.letters.length * 10, 0);
      
      draft.cumulativeScore += currentRoundPoints;
      
      draft.answers = answers.map((answer) => ({
        word: answer,
        letters: Array.from(answer),
        state: 'not-found',
      }));

      draft.scrambledLetters = Array.from(word).map((letter, index) => ({
        value: letter,
        index,
        typedIndex: undefined,
      }));
      
      draft.mostRecentAnswer = undefined;
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
        matchingAnswer.state = 'found';
        draft.mostRecentAnswer = submittedWord;
      }

      draft.scrambledLetters.forEach((letter) => {
        letter.typedIndex = undefined;
      });
    })
  ),
  on(revealGameRequested, (state) =>
    produce(state, (draft) => {
      draft.answers
        .filter((answer) => answer.state === 'not-found')
        .forEach((answer) => {
          answer.state = 'revealed';
        });
    })
  )
);

const calculateNextTypedIndex = (letters: Letter[]) => {
  const lastIndex =
    shared
      .getTypedLetters(letters)
      .map((letter) => letter.typedIndex)
      .reverse()[0] ?? -1;

  return lastIndex + 1;
};
