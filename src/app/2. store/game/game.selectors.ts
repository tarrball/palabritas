import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Answer, GameState } from './game.state';
import * as shared from './game.shared';

export const selectFeature = createFeatureSelector<GameState>('game');

export const selectAnswers = createSelector(
  selectFeature,
  (state) => state.answers
);

export const selectClickableLetters = createSelector(selectFeature, (state) =>
  state.scrambledLetters.filter((letter) => letter.typedIndex === undefined)
);

export const selectClickedLetters = createSelector(selectFeature, (state) =>
  state.scrambledLetters
    .filter(shared.typedLetterFilter)
    .sort((a, b) =>
      shared.typedLetterSort(shared.typedLetterMap(a), shared.typedLetterMap(b))
    )
);

export const selectMostRecentAnswer = createSelector(
  selectFeature,
  (state) => state.mostRecentAnswer
);

export const selectEarnedPoints = createSelector(selectAnswers, (answers) =>
  answers.filter((answer) => answer.state === 'found').reduce(pointsReducer, 0)
);

export const selectPotentialPoints = createSelector(selectAnswers, (answers) =>
  answers.reduce(pointsReducer, 0)
);

export const selectIsGameOver = createSelector(selectAnswers, (answers) =>
  answers.length > 0 && (
    answers.every((answer) => answer.state === 'found') ||
    answers.some((answer) => answer.state === 'revealed')
  )
);

export const selectScore = createSelector(selectFeature, (state) => state.score);

const pointsReducer = (accumulator: number, answer: Answer) =>
  accumulator + answer.letters.length * 10;
