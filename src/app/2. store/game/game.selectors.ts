import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.state';

const PointsPerLetter = 10;

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
    .filter((letter) => letter.typedIndex !== undefined)
    .sort((a, b) => a.typedIndex! - b.typedIndex!)
);

export const selectMostRecentAnswer = createSelector(
  selectFeature,
  (state) => state.mostRecentAnswer
);

export const selectEarnedPoints = createSelector(selectAnswers, (answers) =>
  answers
    .filter((answer) => answer.isFound)
    .reduce((acc, answer) => acc + answer.letters.length * PointsPerLetter, 0)
);

export const selectPotentialPoints = createSelector(selectAnswers, (answers) =>
  answers.reduce(
    (acc, answer) => acc + answer.letters.length * PointsPerLetter,
    0
  )
);
