import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, toArray } from 'rxjs';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { GameService } from 'src/app/3. services/game.service';
import { LocalStorageService } from 'src/app/3. services/local-storage.service';
import { GameEffects } from './game.effects';
import { initialState } from './game.state';
import { generateGame } from 'src/app/4. shared/fakers/game.faker';
import { generateAnswer } from 'src/app/4. shared/fakers/answer.faker';
import { generateLetter } from 'src/app/4. shared/fakers/letter.faker';
import { newGameAfterCompletion, newGameRequested, newGameStarted, restoreStateFromCache, revealGameRequested, wordSubmitted } from './game.actions';
import { selectAnswers, selectScrambledLetters, selectRoundScore, selectTotalScore } from './game.selectors';

describe('GameEffects', () => {
  let effects: GameEffects;
  let actions$: Observable<Action>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    gameServiceSpy = jasmine.createSpyObj('GameService', ['nextGame']);
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'loadGameState',
      'saveGameState',
      'clearGameState'
    ]);

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        {
          provide: GameService,
          useValue: gameServiceSpy,
        },
        {
          provide: LocalStorageService,
          useValue: localStorageServiceSpy,
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

  describe('clearCacheOnNewGame$', () => {
    it('should clear localStorage when newGameStarted is dispatched', (done) => {
      actions$ = of(newGameStarted(generateGame()));

      effects.clearCacheOnNewGame$.pipe(toArray()).subscribe(() => {
        expect(localStorageServiceSpy.clearGameState).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('restoreGameStateOnInit$', () => {
    it('should return restoreStateFromCache when cached state exists', (done) => {
      const cachedState = {
        scrambledLetters: [generateLetter(0)],
        answers: [generateAnswer()],
        roundScore: 50,
        totalScore: 100
      };
      localStorageServiceSpy.loadGameState.and.returnValue(cachedState);
      
      actions$ = of({ type: ROOT_EFFECTS_INIT });

      effects.restoreGameStateOnInit$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([restoreStateFromCache(cachedState)]);
        expect(localStorageServiceSpy.loadGameState).toHaveBeenCalled();
        done();
      });
    });

    it('should return newGameRequested when no cached state exists', (done) => {
      localStorageServiceSpy.loadGameState.and.returnValue(null);
      
      actions$ = of({ type: ROOT_EFFECTS_INIT });

      effects.restoreGameStateOnInit$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([newGameRequested()]);
        expect(localStorageServiceSpy.loadGameState).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('clearCacheOnReveal$', () => {
    it('should clear localStorage when revealGameRequested is dispatched', (done) => {
      actions$ = of(revealGameRequested());

      effects.clearCacheOnReveal$.pipe(toArray()).subscribe(() => {
        expect(localStorageServiceSpy.clearGameState).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('saveGameStateOnWordFound$', () => {
    it('should save game state when a word is found', (done) => {
      const scrambledLetters = [generateLetter(0)];
      const foundAnswer = { ...generateAnswer(), state: 'found' as const };
      const answers = [foundAnswer];
      const roundScore = 20;
      const totalScore = 100;

      // Reinitialize TestBed with mock store values
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          GameEffects,
          {
            provide: GameService,
            useValue: gameServiceSpy,
          },
          {
            provide: LocalStorageService,
            useValue: localStorageServiceSpy,
          },
          provideMockActions(() => of(wordSubmitted())),
          provideMockStore({
            initialState: { game: { scrambledLetters, answers, roundScore, totalScore } },
            selectors: [
              { selector: selectScrambledLetters, value: scrambledLetters },
              { selector: selectAnswers, value: answers },
              { selector: selectRoundScore, value: roundScore },
              { selector: selectTotalScore, value: totalScore }
            ]
          }),
        ],
      });

      effects = TestBed.inject(GameEffects);
      actions$ = of(wordSubmitted());

      effects.saveGameStateOnWordFound$.pipe(toArray()).subscribe(() => {
        expect(localStorageServiceSpy.saveGameState).toHaveBeenCalledWith(
          scrambledLetters,
          answers,
          roundScore,
          totalScore
        );
        done();
      });
    });

    it('should not save game state when no word is found', (done) => {
      const scrambledLetters = [generateLetter(0)];
      const notFoundAnswer = { ...generateAnswer(), state: 'not-found' as const };
      const answers = [notFoundAnswer];
      const roundScore = 0;
      const totalScore = 100;

      // Reinitialize TestBed with mock store values
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          GameEffects,
          {
            provide: GameService,
            useValue: gameServiceSpy,
          },
          {
            provide: LocalStorageService,
            useValue: localStorageServiceSpy,
          },
          provideMockActions(() => of(wordSubmitted())),
          provideMockStore({
            initialState: { game: { scrambledLetters, answers, roundScore, totalScore } },
            selectors: [
              { selector: selectScrambledLetters, value: scrambledLetters },
              { selector: selectAnswers, value: answers },
              { selector: selectRoundScore, value: roundScore },
              { selector: selectTotalScore, value: totalScore }
            ]
          }),
        ],
      });

      effects = TestBed.inject(GameEffects);
      actions$ = of(wordSubmitted());

      effects.saveGameStateOnWordFound$.pipe(toArray()).subscribe(() => {
        expect(localStorageServiceSpy.saveGameState).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
