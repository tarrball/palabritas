import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, toArray } from 'rxjs';
import { GameService } from 'src/app/3. services/game.service';
import { GameEffects } from './game.effects';
import { initialState } from './game.state';
import { generateGame } from 'src/app/4. shared/fakers/game.faker';
import { newGameRequested, newGameAfterCompletion, newGameStarted, wordSubmitted, wordFound, wordNotFound } from './game.actions';

describe('GameEffects', () => {
  let effects: GameEffects;
  let actions$: Observable<Action>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;

  beforeEach(() => {
    gameServiceSpy = jasmine.createSpyObj('GameService', ['nextGame']);

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        {
          provide: GameService,
          useValue: gameServiceSpy,
        },
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { game: initialState } }),
      ],
    });

    effects = TestBed.inject(GameEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('requestNewGame$', () => {
    it('should return newGameStarted action with nextGame from GameService', (done) => {
      actions$ = of(newGameRequested());

      const nextGame = generateGame();

      gameServiceSpy.nextGame.and.returnValue(nextGame);

      effects.requestNewGame$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([newGameStarted(nextGame)]);

        done();
      });
    });

    it('should return newGameStarted action for newGameAfterCompletion', (done) => {
      actions$ = of(newGameAfterCompletion());

      const nextGame = generateGame();

      gameServiceSpy.nextGame.and.returnValue(nextGame);

      effects.requestNewGame$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([newGameStarted(nextGame)]);

        done();
      });
    });
  });

  describe('submitWord$', () => {
    it('should return wordFound action when word matches an answer', (done) => {
      const testState = {
        ...initialState,
        answers: [
          { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'not-found' as const },
          { word: 'SET', letters: ['S', 'E', 'T'], state: 'not-found' as const }
        ],
        scrambledLetters: [
          { value: 'T', index: 0, typedIndex: 0 },
          { value: 'E', index: 1, typedIndex: 1 },
          { value: 'S', index: 2, typedIndex: 2 },
          { value: 'T', index: 3, typedIndex: 3 }
        ]
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          GameEffects,
          {
            provide: GameService,
            useValue: gameServiceSpy,
          },
          provideMockActions(() => actions$),
          provideMockStore({ initialState: { game: testState } }),
        ],
      });

      effects = TestBed.inject(GameEffects);
      actions$ = of(wordSubmitted());

      effects.submitWord$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([wordFound({ word: 'TEST' })]);
        done();
      });
    });

    it('should return wordNotFound action when word does not match any answer', (done) => {
      const testState = {
        ...initialState,
        answers: [
          { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'not-found' as const },
          { word: 'SET', letters: ['S', 'E', 'T'], state: 'not-found' as const }
        ],
        scrambledLetters: [
          { value: 'B', index: 0, typedIndex: 0 },
          { value: 'A', index: 1, typedIndex: 1 },
          { value: 'D', index: 2, typedIndex: 2 }
        ]
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          GameEffects,
          {
            provide: GameService,
            useValue: gameServiceSpy,
          },
          provideMockActions(() => actions$),
          provideMockStore({ initialState: { game: testState } }),
        ],
      });

      effects = TestBed.inject(GameEffects);
      actions$ = of(wordSubmitted());

      effects.submitWord$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([wordNotFound()]);
        done();
      });
    });

    it('should handle empty typed letters', (done) => {
      const testState = {
        ...initialState,
        answers: [
          { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'not-found' as const }
        ],
        scrambledLetters: [
          { value: 'T', index: 0, typedIndex: undefined },
          { value: 'E', index: 1, typedIndex: undefined },
          { value: 'S', index: 2, typedIndex: undefined },
          { value: 'T', index: 3, typedIndex: undefined }
        ]
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          GameEffects,
          {
            provide: GameService,
            useValue: gameServiceSpy,
          },
          provideMockActions(() => actions$),
          provideMockStore({ initialState: { game: testState } }),
        ],
      });

      effects = TestBed.inject(GameEffects);
      actions$ = of(wordSubmitted());

      effects.submitWord$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([wordNotFound()]);
        done();
      });
    });
  });
});
