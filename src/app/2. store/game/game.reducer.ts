import { createReducer, on } from '@ngrx/store';
import { Letter, initialState } from './game.state';
import {
  letterTapped,
  newGameStarted,
  newGameRequested,
  newGameAfterCompletion,
  wordSubmitted,
  revealGameRequested,
  shuffleRequested,
  restoreStateFromCache,
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
      // Reset to initial state but preserve the score from completed game
      draft.score = state.score;
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
        draft.score += matchingAnswer.letters.length * 10;
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
  ),
  on(restoreStateFromCache, (state, { scrambledLetters, answers, score }) =>
    produce(state, (draft) => {
      // Restore the scrambled letters (ensuring typedIndex is cleared)
      draft.scrambledLetters = scrambledLetters.map((letter) => ({
        ...letter,
        typedIndex: undefined,
      }));
      
      // Restore the answers with their found/revealed states
      draft.answers = answers.map((answer) => ({
        word: answer.word,
        letters: Array.from(answer.word),
        state: answer.found ? 'found' : answer.revealed ? 'revealed' : 'not-found',
      }));
      
      // Restore the score
      draft.score = score;
      
      // Clear mostRecentAnswer to start fresh
      draft.mostRecentAnswer = undefined;
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
