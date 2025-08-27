import { createAction, props } from '@ngrx/store';
import { Letter } from '../../4. shared/types';
import { Answer } from './game.state';

export const letterTapped = createAction(
  '[Game] Letter Tapped',
  props<{ index: number }>()
);

export const newGameAfterCompletion = createAction('[Game] New Game After Completion');

export const newGameRequested = createAction('[Game] New Game Requested');

export const newGameStarted = createAction(
  '[Game] New Game Started',
  props<{ word: string; answers: string[] }>()
);

export const restoreStateFromCache = createAction(
  '[Game] Restore State From Cache',
  props<{ 
    scrambledLetters: Letter[];
    answers: Answer[];
    roundScore: number;
    totalScore: number;
  }>()
);

export const revealGameRequested = createAction('[Game] Reveal Game Requested');

export const shuffleRequested = createAction('[Game] Shuffle Requested');

export const wordSubmitted = createAction('[Game] Word Submitted');
