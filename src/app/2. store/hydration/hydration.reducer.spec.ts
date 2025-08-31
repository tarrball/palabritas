import { ActionReducer } from '@ngrx/store';
import { hydrationMetaReducer } from './hydration.reducer';
import * as HydrationActions from './hydration.actions';
import { State } from '..';
import { GameState } from '../game/game.state';

describe('HydrationMetaReducer', () => {
  let mockReducer: ActionReducer<any>;
  let metaReducer: ActionReducer<any>;

  const mockGameState: GameState = {
    answers: [],
    scrambledLetters: [],
    mostRecentAnswer: undefined,
    score: 0
  };

  const mockState: State = {
    game: mockGameState
  };

  beforeEach(() => {
    mockReducer = jasmine.createSpy('mockReducer').and.returnValue({ mocked: 'state' });
    metaReducer = hydrationMetaReducer(mockReducer);
  });

  it('should replace state with hydrated state on hydrateSuccess action', () => {
    const hydratedState: State = {
      game: {
        answers: [{ word: 'test', letters: ['t', 'e', 's', 't'], state: 'found' }],
        scrambledLetters: [],
        mostRecentAnswer: 'test',
        score: 100
      }
    };
    const action = HydrationActions.hydrateSuccess({ state: hydratedState });
    const currentState = { current: 'state' };

    const result = metaReducer(currentState, action);

    expect(result).toEqual(hydratedState);
    expect(mockReducer).not.toHaveBeenCalled();
  });

  it('should delegate to original reducer for non-hydration actions', () => {
    const currentState = { current: 'state' };
    const action = { type: 'Some Other Action' };

    const result = metaReducer(currentState, action);

    expect(mockReducer).toHaveBeenCalledWith(currentState, action);
    expect(result).toEqual({ mocked: 'state' });
  });

  it('should delegate to original reducer for hydrate action', () => {
    const currentState = { current: 'state' };
    const action = HydrationActions.hydrate();

    const result = metaReducer(currentState, action);

    expect(mockReducer).toHaveBeenCalledWith(currentState, action);
    expect(result).toEqual({ mocked: 'state' });
  });
});