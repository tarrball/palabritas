import { Action, ActionReducer } from '@ngrx/store';
import * as HydrationActions from './hydration.actions';

/**
 * Type guard to check if an action is a hydrate success action.
 */
function isHydrateSuccess(
  action: Action
): action is ReturnType<typeof HydrationActions.hydrateSuccess> {
  return action.type === HydrationActions.hydrateSuccess.type;
}

/**
 * Meta-reducer to handle hydration of the state.
 * If a hydrate success action is dispatched, it replaces the current state with the hydrated state.
 * Otherwise, it delegates to the original reducer.
 */
export const hydrationMetaReducer = (
  reducer: ActionReducer<unknown>
): ActionReducer<unknown> => {
  return (state, action) => {
    if (isHydrateSuccess(action)) {
      return action.state;
    } else {
      return reducer(state, action);
    }
  };
};
