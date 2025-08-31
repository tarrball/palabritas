import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { HydrationEffects } from './hydration.effects';

describe('HydrationEffects', () => {
  let actions$: Observable<any>;
  let effects: HydrationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HydrationEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(HydrationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});