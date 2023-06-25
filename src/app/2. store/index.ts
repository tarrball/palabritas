import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { GameState } from './game/game.state';
import { gameReducer } from './game/game.reducer';

export interface State {
  game: GameState;
}

export const reducers: ActionReducerMap<State> = {
  game: gameReducer,
};

export const metaReducers: MetaReducer<State>[] = [];
