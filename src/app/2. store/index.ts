import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { GameState } from './game/game.state';
import { gameReducer } from './game/game.reducer';
import { hydrationMetaReducer } from './hydration/hydration.reducer';

export interface State {
  game: GameState;
}

export const selectState = (state: State) => state;

export const reducers: ActionReducerMap<State> = {
  game: gameReducer,
};

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];
