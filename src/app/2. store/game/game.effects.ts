import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GameService } from 'src/app/3. services/game.service';
import { newGameStarted, newGameRequested, newGameAfterCompletion, wordSubmitted, wordFound, wordNotFound } from './game.actions';
import { mergeMap, of, map } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { selectFeature } from './game.selectors';
import * as shared from './game.shared';

@Injectable()
export class GameEffects {
  private readonly actions$ = inject(Actions);
  private readonly gameService = inject(GameService);
  private readonly store = inject(Store);

  public requestNewGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(newGameRequested, newGameAfterCompletion),
      mergeMap(() => of(newGameStarted(this.gameService.nextGame())))
    );
  });

  public submitWord$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(wordSubmitted),
      concatLatestFrom(() => this.store.select(selectFeature)),
      map(([, state]) => {
        const submittedLetters = shared.getTypedLetters(state.scrambledLetters);
        const submittedWord = submittedLetters
          .map((letter) => letter.value)
          .join('');

        const matchingAnswer = state.answers.find(
          (answer) => answer.word === submittedWord
        );

        if (matchingAnswer) {
          return wordFound({ word: submittedWord });
        } else {
          return wordNotFound();
        }
      })
    );
  });
}
