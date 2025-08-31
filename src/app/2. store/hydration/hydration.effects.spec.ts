import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { HydrationEffects } from './hydration.effects';
import { LocalStorageService } from '../../3. services/local-storage.service';
import * as HydrationActions from './hydration.actions';
import * as GameActions from '../game/game.actions';
import { State } from '..';
import { GameState } from '../game/game.state';

describe('HydrationEffects', () => {
  let actions$: Observable<any>;
  let effects: HydrationEffects;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  const mockGameState: GameState = {
    answers: [],
    scrambledLetters: [],
    mostRecentAnswer: undefined,
    score: 0
  };

  const mockState: State = {
    game: mockGameState
  };

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getState']);

    TestBed.configureTestingModule({
      providers: [
        HydrationEffects,
        provideMockActions(() => actions$),
        { provide: LocalStorageService, useValue: localStorageSpy }
      ],
    });

    effects = TestBed.inject(HydrationEffects);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('ngrxOnInitEffects', () => {
    it('should return hydrate action', () => {
      const action = effects.ngrxOnInitEffects();
      expect(action).toEqual(HydrationActions.hydrate());
    });
  });

  describe('hydrate$', () => {
    it('should dispatch hydrateSuccess when state exists in localStorage', (done) => {
      localStorageService.getState.and.returnValue(mockState);
      actions$ = of(HydrationActions.hydrate());

      effects.hydrate$.subscribe(action => {
        expect(action).toEqual(HydrationActions.hydrateSuccess({ state: mockState }));
        done();
      });
    });

    it('should dispatch newGameRequested when state does not exist in localStorage', (done) => {
      localStorageService.getState.and.returnValue(null);
      actions$ = of(HydrationActions.hydrate());

      effects.hydrate$.subscribe(action => {
        expect(action).toEqual(GameActions.newGameRequested());
        done();
      });
    });

    it('should call getState on LocalStorageService', (done) => {
      localStorageService.getState.and.returnValue(null);
      actions$ = of(HydrationActions.hydrate());

      effects.hydrate$.subscribe(() => {
        expect(localStorageService.getState).toHaveBeenCalled();
        done();
      });
    });
  });
});