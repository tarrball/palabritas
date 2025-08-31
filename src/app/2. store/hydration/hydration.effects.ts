import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class HydrationEffects {
  constructor(private actions$: Actions) {}
}