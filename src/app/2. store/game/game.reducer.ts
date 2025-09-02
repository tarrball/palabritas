import { createReducer, on } from '@ngrx/store';
import { Letter, GameState, initialState } from './game.state';
import {
  letterTapped,
  newGameStarted,
  newGameRequested,
  newGameAfterCompletion,
  wordSubmitted,
  wordFound,
  wordNotFound,
  revealGameRequested,
  shuffleRequested,
} from './game.actions';
import * as shared from './game.shared';
import { produce } from 'immer';

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const gameReducer = createReducer(
  initialState,
  on(newGameRequested, () =>
    produce(initialState, (draft) => {
      // Fresh start - return to initial state with score reset
      // Since we want a complete reset, we just return the initial state
      return draft;
    })
  ),
  on(newGameAfterCompletion, (state) =>
    produce(initialState, (draft) => {
      // Reset to initial state but preserve the score from completed game,
      // unless they revealed the answers.
      draft.score = state.answers.some((a) => a.state === 'revealed')
        ? 0
        : state.score;

      return draft;
    })
  ),
  on(newGameStarted, (state, { word, answers }) =>
    produce(state, (draft) => {
      draft.answers = answers.map((answer) => ({
        word: answer,
        letters: Array.from(answer),
        state: 'not-found',
      }));

      const letters = Array.from(word);
      const shuffledLetters = shuffleArray(letters);

      draft.scrambledLetters = shuffledLetters.map((letter, index) => ({
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
  on(wordSubmitted, (state): GameState => state),
  on(wordFound, (state, { word }) =>
    produce(state, (draft) => {
      const matchingAnswer = draft.answers.find(
        (answer) => answer.word === word
      )!; // Non-null assertion since effect guarantees this exists

      matchingAnswer.state = 'found';
      draft.mostRecentAnswer = word;
      draft.score += matchingAnswer.letters.length * 10;

      // Reset letter selections after processing the word
      draft.scrambledLetters.forEach((letter) => {
        letter.typedIndex = undefined;
      });
    })
  ),
  on(wordNotFound, (state) =>
    produce(state, (draft) => {
      // Reset letter selections after failed word attempt
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
      // Keep score - user should see their earned points until new game
    })
  ),
  on(shuffleRequested, (state) =>
    produce(state, (draft) => {
      // Create a new shuffled arrangement that's different from current
      const currentOrder = draft.scrambledLetters.map((l) => l.value).join('');
      let shuffled = [...draft.scrambledLetters];
      let newOrder = currentOrder;

      // Keep shuffling until we get a different arrangement (with max attempts for edge cases)
      let attempts = 0;
      const maxAttempts = 10;

      while (newOrder === currentOrder && attempts < maxAttempts) {
        shuffled = shuffleArray(draft.scrambledLetters);
        newOrder = shuffled.map((l) => l.value).join('');
        attempts++;
      }

      // Update the scrambled letters with the new order
      draft.scrambledLetters = shuffled.map((letter, index) => ({
        ...letter,
        index,
      }));
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
