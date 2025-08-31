import { Injectable, inject } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map } from 'rxjs';
import * as GameActions from '../game/game.actions';
import * as HydrationActions from './hydration.actions';
import { LocalStorageService } from '../../3. services/local-storage.service';

@Injectable()
export class HydrationEffects implements OnInitEffects {
  private action$ = inject(Actions);
  private localStorageService = inject(LocalStorageService);

  /**
   * Hydrate the state from local storage.
   * If the state is successfully retrieved, dispatch the hydrateSuccess action.
   * If the state is not found, dispatch the hydrateFailure action.
   */
  hydrate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(HydrationActions.hydrate),
      map(() => {
        const state = this.localStorageService.getState();

        return state
          ? HydrationActions.hydrateSuccess({ state })
          : GameActions.newGameRequested();
      })
    );
  });

  /**
   * Automatically dispatches the hydrate action when the NgRx effects are initialized.
   * This ensures state hydration happens on app startup.
   * @returns The hydrate action to be dispatched on initialization
   */
  ngrxOnInitEffects(): Action {
    return HydrationActions.hydrate();
  }
}
