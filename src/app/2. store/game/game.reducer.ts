import { createReducer, on } from '@ngrx/store';
import { initialState } from './game.state';
import { startGame } from './game.actions';
import { produce } from 'immer';

export const gameReducer = createReducer(
  initialState,
  on(startGame, (state) =>
    produce(state, (draft) => {
      draft.answers = [];
      draft.scrambedLetters = [];
      draft.mostRecentAnswer = undefined;
    })
  )
);
