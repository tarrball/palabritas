import { createReducer, on } from '@ngrx/store';
import { initialState } from './game.state';
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
        // TODO a bit of redundancy here
        word: answer,
        letters: Array.from(answer),
        isRevealed: false,
      }));

      draft.scrambedLetters = Array.from(word).map((letter, index) => ({
        value: letter,
        index,
        typedIndex: undefined,
      }));
    })
  ),
  on(letterTapped, (state, { index }) =>
    produce(state, (draft) => {
      if (draft.scrambedLetters[index].typedIndex !== undefined) {
        draft.scrambedLetters[index].typedIndex = undefined;
        return;
      }

      const typedIndexes = draft.scrambedLetters
        .map((l) => l.typedIndex)
        .filter((i) => i !== undefined)
        .sort();

      if (typedIndexes.length) {
        const lastTypedIndex = typedIndexes[typedIndexes.length - 1];
        draft.scrambedLetters[index].typedIndex = lastTypedIndex! + 1;
      } else {
        draft.scrambedLetters[index].typedIndex = 0;
      }
    })
  ),
  on(wordSubmitted, (state) =>
    produce(state, (draft) => {
      const submittedLetters = draft.scrambedLetters
        .filter((letter) => letter.typedIndex !== undefined)
        .sort((a, b) => a.typedIndex! - b.typedIndex!);

      const submittedWord = submittedLetters
        .map((letter) => letter.value)
        .join('');

      const matchingAnswer = draft.answers.find(
        (answer) => answer.letters.join('') === submittedWord
      );

      if (matchingAnswer) {
        matchingAnswer.isRevealed = true;
        draft.mostRecentAnswer = submittedWord;
      }

      draft.scrambedLetters.forEach((letter) => {
        letter.typedIndex = undefined;
      });
    })
  )
);
