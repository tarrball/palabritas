import { Injectable, inject } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { GameService } from 'src/app/3. services/game.service';
import { LocalStorageService } from 'src/app/3. services/local-storage.service';
import { Store } from '@ngrx/store';
import { newGameStarted, newGameRequested, newGameAfterCompletion, wordSubmitted, restoreStateFromCache } from './game.actions';
import { mergeMap, of, tap, map } from 'rxjs';
import { selectScrambledLetters, selectAnswers, selectScore } from './game.selectors';

@Injectable()
export class GameEffects {
  private readonly actions$ = inject(Actions);
  private readonly gameService = inject(GameService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly store = inject(Store);

  public requestNewGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(newGameRequested, newGameAfterCompletion),
      mergeMap(() => of(newGameStarted(this.gameService.nextGame())))
    );
  });

  public saveGameStateOnWordFound$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(wordSubmitted),
        concatLatestFrom(() => [
          this.store.select(selectScrambledLetters),
          this.store.select(selectAnswers),
          this.store.select(selectScore)
        ]),
        tap(([, scrambledLetters, answers, score]) => {
          // Check if a word was actually found by looking for at least one found answer
          const hasFoundWord = answers.some(answer => answer.state === 'found');
          if (hasFoundWord) {
            // Map answers back to the simplified format for storage
            const simplifiedAnswers = answers.map(answer => ({
              word: answer.word,
              found: answer.state === 'found',
              revealed: answer.state === 'revealed'
            }));
            this.localStorageService.saveGameState(scrambledLetters, simplifiedAnswers, score);
          }
        })
      );
    },
    { dispatch: false }
  );

  public restoreGameStateOnInit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const cachedState = this.localStorageService.loadGameState();
        if (cachedState) {
          return restoreStateFromCache({
            scrambledLetters: cachedState.scrambledLetters,
            answers: cachedState.answers,
            score: cachedState.score
          });
        } else {
          // If no cached state, start a new game
          return newGameRequested();
        }
      })
    );
  });

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
}
