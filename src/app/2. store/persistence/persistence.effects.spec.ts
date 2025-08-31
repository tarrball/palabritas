import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { PersistenceEffects } from './persistence.effects';
import { LocalStorageService } from '../../3. services/local-storage.service';
import * as GameActions from '../game/game.actions';
import { State } from '..';
import { GameState } from '../game/game.state';

describe('PersistenceEffects', () => {
  let actions$: Observable<unknown>;
  let effects: PersistenceEffects;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let store: MockStore;

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
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['clearState', 'saveState']);

    TestBed.configureTestingModule({
      providers: [
        PersistenceEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: mockState }),
        { provide: LocalStorageService, useValue: localStorageSpy }
      ],
    });

    effects = TestBed.inject(PersistenceEffects);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('clearState$', () => {
    it('should call clearState when newGameRequested action is dispatched', (done) => {
      actions$ = of(GameActions.newGameRequested());

      effects.clearState$.subscribe(() => {
        expect(localStorageService.clearState).toHaveBeenCalled();
        done();
      });
    });

    it('should call clearState when revealGameRequested action is dispatched', (done) => {
      actions$ = of(GameActions.revealGameRequested());

      effects.clearState$.subscribe(() => {
        expect(localStorageService.clearState).toHaveBeenCalled();
        done();
      });
    });

    it('should not dispatch any actions (dispatch: false)', (done) => {
      actions$ = of(GameActions.newGameRequested());

      effects.clearState$.subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });

  describe('saveState$', () => {
    it('should call saveState with current state when wordFound action is dispatched', (done) => {
      const wordFoundAction = GameActions.wordFound({ 
        word: 'test'
      });
      actions$ = of(wordFoundAction);

      // Set the mock store state
      store.setState(mockState);

      effects.saveState$.subscribe(() => {
        expect(localStorageService.saveState).toHaveBeenCalledWith(mockState);
        done();
      });
    });

    it('should not dispatch any actions (dispatch: false)', (done) => {
      const wordFoundAction = GameActions.wordFound({ 
        word: 'test'
      });
      actions$ = of(wordFoundAction);

      effects.saveState$.subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should not trigger on other actions', (done) => {
      actions$ = of(GameActions.letterTapped({ index: 0 }));
      let effectTriggered = false;

      const subscription = effects.saveState$.subscribe(() => {
        effectTriggered = true;
      });

      // Give it a moment to potentially trigger
      setTimeout(() => {
        expect(effectTriggered).toBeFalse();
        expect(localStorageService.saveState).not.toHaveBeenCalled();
        subscription.unsubscribe();
        done();
      }, 10);
    });
  });
});