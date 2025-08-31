import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { LocalStorageService } from '../../3. services/local-storage.service';
import * as GameActions from '../game/game.actions';
import { Store } from '@ngrx/store';
import { selectState } from '..';

@Injectable()
export class PersistenceEffects {
  private action$ = inject(Actions);
  private store = inject(Store).select(selectState);
  private localStorageService = inject(LocalStorageService);

  /**
   * Clear the state from local storage when a new game is started or the current game is revealed
   */
  clearState$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(GameActions.newGameRequested, GameActions.revealGameRequested),
        map(() => {
          this.localStorageService.clearState();
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Save the current state to local storage
   */
  saveState$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(GameActions.wordFound),
        switchMap(() => this.store),
        map((state) => {
          this.localStorageService.saveState(state);
        })
      );
    },
    { dispatch: false }
  );
}
