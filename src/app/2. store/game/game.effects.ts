import { Injectable, inject } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { map, mergeMap, of, tap } from 'rxjs';
import { GameService } from 'src/app/3. services/game.service';
import { LocalStorageService } from 'src/app/3. services/local-storage.service';
import { newGameAfterCompletion, newGameRequested, newGameStarted, restoreStateFromCache, revealGameRequested, wordSubmitted } from './game.actions';
import { selectScrambledLetters, selectAnswers, selectRoundScore, selectTotalScore } from './game.selectors';

@Injectable()
export class GameEffects {
  private readonly actions$ = inject(Actions);
  private readonly gameService = inject(GameService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly store = inject(Store);

  public clearCacheOnNewGame$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(newGameStarted),
        tap(() => {
          // Clear the cache when a new game starts
          this.localStorageService.clearGameState();
        })
      );
    },
    { dispatch: false }
  );

  public clearCacheOnReveal$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(revealGameRequested),
        tap(() => {
          // Clear the cache when game is revealed (game session is over)
          this.localStorageService.clearGameState();
        })
      );
    },
    { dispatch: false }
  );

  public requestNewGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(newGameRequested, newGameAfterCompletion),
      mergeMap(() => of(newGameStarted(this.gameService.nextGame())))
    );
  });

  public restoreGameStateOnInit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const cachedState = this.localStorageService.loadGameState();
        if (cachedState) {
          return restoreStateFromCache({
            scrambledLetters: cachedState.scrambledLetters,
            answers: cachedState.answers,
            roundScore: cachedState.roundScore,
            totalScore: cachedState.totalScore
          });
        } else {
          // If no cached state, start a new game
          return newGameRequested();
        }
      })
    );
  });

  public saveGameStateOnWordFound$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(wordSubmitted),
        concatLatestFrom(() => [
          this.store.select(selectScrambledLetters),
          this.store.select(selectAnswers),
          this.store.select(selectRoundScore),
          this.store.select(selectTotalScore)
        ]),
        tap(([, scrambledLetters, answers, roundScore, totalScore]) => {
          // Check if a word was actually found by looking for at least one found answer
          const hasFoundWord = answers.some(answer => answer.state === 'found');
          if (hasFoundWord) {
            this.localStorageService.saveGameState(scrambledLetters, answers, roundScore, totalScore);
          }
        })
      );
    },
    { dispatch: false }
  );
}
