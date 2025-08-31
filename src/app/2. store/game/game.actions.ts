import { createAction, props } from '@ngrx/store';

export const newGameRequested = createAction('[Game] New Game Requested');

export const newGameAfterCompletion = createAction('[Game] New Game After Completion');

export const newGameStarted = createAction(
  '[Game] New Game Started',
  props<{ word: string; answers: string[] }>()
);

export const letterTapped = createAction(
  '[Game] Letter Tapped',
  props<{ index: number }>()
);

export const wordSubmitted = createAction('[Game] Word Submitted');

export const wordFound = createAction(
  '[Game] Word Found',
  props<{ word: string }>()
);

export const wordNotFound = createAction('[Game] Word Not Found');

export const revealGameRequested = createAction('[Game] Reveal Game Requested');

export const shuffleRequested = createAction('[Game] Shuffle Requested');
