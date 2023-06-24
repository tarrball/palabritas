import { createFeatureSelector } from '@ngrx/store';
import { GameState } from './game.state';

export const selectFeature = createFeatureSelector<GameState>('game');
