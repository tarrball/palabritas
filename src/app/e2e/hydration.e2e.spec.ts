import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GameEffects } from '../2. store/game/game.effects';
import { HydrationEffects } from '../2. store/hydration/hydration.effects';
import { PersistenceEffects } from '../2. store/persistence/persistence.effects';
import { GameService } from '../3. services/game.service';
import {
  letterTapped,
  wordSubmitted,
  newGameAfterCompletion,
  revealGameRequested,
} from '../2. store/game/game.actions';
import {
  selectScore,
  selectAnswers,
  selectFeature,
  selectIsGameOver,
} from '../2. store/game/game.selectors';
import { reducers, metaReducers } from '../2. store';
import { Letter } from '../2. store/game/game.state';
import { LocalStorageService } from '../3. services/local-storage.service';

describe('Hydration E2E', () => {
  let store: Store;
  let gameService: jasmine.SpyObj<GameService>;

  beforeEach(() => {
    localStorage.clear();

    gameService = jasmine.createSpyObj('GameService', ['nextGame']);
    gameService.nextGame.and.returnValues(
      {
        word: 'CAT',
        answers: ['CAT', 'ACT', 'AT', 'TA'],
      },
      {
        word: 'DOG',
        answers: ['DOG', 'GOD', 'DO', 'GO'],
      }
    );

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([
          GameEffects,
          HydrationEffects,
          PersistenceEffects,
        ]),
      ],
      providers: [{ provide: GameService, useValue: gameService }],
    });

    store = TestBed.inject(Store);
  });

  it('should preserve score when starting new game after completion', () => {
    // Find a word to get some score
    const gameState = store.selectSignal(selectFeature)();
    const letters = gameState.scrambledLetters;
    const cIndex = letters.findIndex((l: Letter) => l.value === 'C');
    const aIndex = letters.findIndex((l: Letter) => l.value === 'A');
    const tIndex = letters.findIndex((l: Letter) => l.value === 'T');

    store.dispatch(letterTapped({ index: cIndex }));
    store.dispatch(letterTapped({ index: aIndex }));
    store.dispatch(letterTapped({ index: tIndex }));
    store.dispatch(wordSubmitted());

    let score = store.selectSignal(selectScore)();
    expect(score).toBe(30);

    // Use newGameAfterCompletion action
    store.dispatch(newGameAfterCompletion());

    // Score should be preserved
    score = store.selectSignal(selectScore)();
    expect(score).toBe(30);

    // New game should have started
    const answers = store.selectSignal(selectAnswers)();
    expect(answers.map((a) => a.word)).toContain('DOG');

    const localStorageService = TestBed.inject(LocalStorageService);
    const cachedState = localStorageService.getState();
    expect(cachedState!.game.score).toBe(30);
  });

  it('should reset score when starting a new game after reveal', () => {
    // Find a word to get some score
    const gameState = store.selectSignal(selectFeature)();
    const letters = gameState.scrambledLetters;
    const cIndex = letters.findIndex((l: Letter) => l.value === 'C');
    const aIndex = letters.findIndex((l: Letter) => l.value === 'A');
    const tIndex = letters.findIndex((l: Letter) => l.value === 'T');

    store.dispatch(letterTapped({ index: cIndex }));
    store.dispatch(letterTapped({ index: aIndex }));
    store.dispatch(letterTapped({ index: tIndex }));
    store.dispatch(wordSubmitted());

    let score = store.selectSignal(selectScore)();
    expect(score).toBe(30);

    // Reveal the game
    store.dispatch(revealGameRequested());

    // Verify game is over after reveal
    const isGameOver = store.selectSignal(selectIsGameOver)();
    expect(isGameOver).toBe(true);

    // Score should still be 30 after reveal
    score = store.selectSignal(selectScore)();
    expect(score).toBe(30);

    // Start a new game after reveal
    store.dispatch(newGameAfterCompletion());

    // Score should be reset to 0
    score = store.selectSignal(selectScore)();
    expect(score).toBe(0);

    // New game should have started
    const answers = store.selectSignal(selectAnswers)();
    expect(answers.map((a) => a.word)).toContain('DOG');
    expect(answers.every((a) => a.state === 'not-found')).toBe(true);

    const localStorageService = TestBed.inject(LocalStorageService);
    const cachedState = localStorageService.getState();
    expect(cachedState!.game.score).toBe(0);
  });
});
