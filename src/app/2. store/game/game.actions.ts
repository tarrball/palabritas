import { createAction, props } from '@ngrx/store';

export const newGameRequested = createAction(
  '[Game] New Game Requested',
  props<{ preserveScore?: boolean }>()
);

export const newGameStarted = createAction(
  '[Game] New Game Started',
  props<{ word: string; answers: string[] }>()
);

export const letterTapped = createAction(
  '[Game] Letter Tapped',
  props<{ index: number }>()
);

export const wordSubmitted = createAction('[Game] Word Submitted');

export const revealGameRequested = createAction('[Game] Reveal Game Requested');
