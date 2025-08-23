import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameService } from 'src/app/3. services/game.service';
import { 
  newGameStarted, 
  newGameRequested, 
  nextRoundRequested,
  resetGameRequested 
} from './game.actions';
import { mergeMap, of } from 'rxjs';

@Injectable()
export class GameEffects {
  private readonly actions$ = inject(Actions);
  private readonly gameService = inject(GameService);

  public requestNewGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(newGameRequested),
      mergeMap(() => of(newGameStarted(this.gameService.nextGame())))
    );
  });

  public requestNextRound$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(nextRoundRequested),
      mergeMap(() => of(newGameStarted(this.gameService.nextGame())))
    );
  });

  public requestReset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(resetGameRequested),
      mergeMap(() => of(newGameStarted(this.gameService.nextGame())))
    );
  });
}
