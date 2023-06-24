import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.state';

export const selectFeature = createFeatureSelector<GameState>('game');

export const selectAnswers = createSelector(
  selectFeature,
  (state) => state.answers
);

export const selectClickableLetters = createSelector(selectFeature, (state) =>
  state.scrambedLetters.filter((letter) => letter.typedIndex === undefined)
);

export const selectClickedLetters = createSelector(selectFeature, (state) =>
  state.scrambedLetters.filter((letter) => letter.typedIndex !== undefined)
);

export const selectMostRecentAnswer = createSelector(
  selectFeature,
  (state) => state.mostRecentAnswer
);
