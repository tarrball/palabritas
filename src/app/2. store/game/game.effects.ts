import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameService } from 'src/app/3. services/game.service';
import { newGameStarted, newGameRequested } from './game.actions';
import { mergeMap, of } from 'rxjs';

@Injectable()
export class GameEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly gameService: GameService
  ) {}

  public requestNewGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(newGameRequested),
      mergeMap(() => of(newGameStarted(this.gameService.nextGame())))
    );
  });
}
