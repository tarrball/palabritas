import { createReducer } from '@ngrx/store';
import { produce } from 'immer';
import { HydrationState } from './hydration.state';

export const initialState: HydrationState = {};

export const hydrationReducer = createReducer(initialState);