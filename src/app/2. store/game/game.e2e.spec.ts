import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { GameService } from 'src/app/3. services/game.service';
import { LocalStorageService } from 'src/app/3. services/local-storage.service';
import { 
  letterTapped, 
  newGameAfterCompletion, 
  newGameStarted, 
  restoreStateFromCache, 
  wordSubmitted 
} from './game.actions';
import { gameReducer } from './game.reducer';
import { GameState, initialState } from './game.state';

describe('Game E2E Flow', () => {
  let gameService: jasmine.SpyObj<GameService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const gameServiceSpy = jasmine.createSpyObj('GameService', ['nextGame']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'saveGameState',
      'loadGameState',
      'clearGameState'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: GameService, useValue: gameServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        provideMockStore({ initialState: { game: initialState } })
      ]
    });

    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should maintain total score across game completion and cache restore', () => {
    // Simulate starting with an existing total score from previous games
    let state: GameState = { 
      ...initialState, 
      roundScore: 0, 
      totalScore: 500 // Player already has 500 points from previous games
    };

    // Start a new game
    gameService.nextGame.and.returnValue({
      word: 'cats',
      answers: ['cat', 'cats', 'act', 'sat']
    });

    state = gameReducer(state, newGameStarted({
      word: 'cats',
      answers: ['cat', 'cats', 'act', 'sat']
    }));

    // Verify game started correctly with preserved total score
    expect(state.totalScore).toBe(500);
    expect(state.roundScore).toBe(0);
    expect(state.answers.length).toBe(4);
    expect(state.scrambledLetters.length).toBe(4);

    // Player finds first word "cat" (3 letters = 30 points)
    // Find the actual positions of c, a, t in the scrambled letters
    const cIndex = state.scrambledLetters.findIndex(l => l.value === 'c');
    const aIndex = state.scrambledLetters.findIndex(l => l.value === 'a');  
    const tIndex = state.scrambledLetters.findIndex(l => l.value === 't');
    
    // Simulate clicking letters c-a-t in their actual positions
    state = gameReducer(state, letterTapped({ index: cIndex })); // c
    state = gameReducer(state, letterTapped({ index: aIndex })); // a  
    state = gameReducer(state, letterTapped({ index: tIndex })); // t
    state = gameReducer(state, wordSubmitted());

    // Verify round score increased, total score unchanged
    expect(state.roundScore).toBe(30);
    expect(state.totalScore).toBe(500);
    expect(state.answers.find(a => a.word === 'cat')?.state).toBe('found');

    // Player finds second word "act" (3 letters = 30 points)  
    // Reuse the same letter positions (they're still in the same scrambled positions)
    state = gameReducer(state, letterTapped({ index: aIndex })); // a
    state = gameReducer(state, letterTapped({ index: cIndex })); // c
    state = gameReducer(state, letterTapped({ index: tIndex })); // t
    state = gameReducer(state, wordSubmitted());

    // Verify round score increased further
    expect(state.roundScore).toBe(60);
    expect(state.totalScore).toBe(500);

    // Player finds third word "sat" (3 letters = 30 points)
    const sIndex = state.scrambledLetters.findIndex(l => l.value === 's');
    state = gameReducer(state, letterTapped({ index: sIndex })); // s
    state = gameReducer(state, letterTapped({ index: aIndex })); // a
    state = gameReducer(state, letterTapped({ index: tIndex })); // t
    state = gameReducer(state, wordSubmitted());

    // Verify round score increased
    expect(state.roundScore).toBe(90);
    expect(state.totalScore).toBe(500);

    // Player finds final word "cats" (4 letters = 40 points)
    state = gameReducer(state, letterTapped({ index: cIndex })); // c
    state = gameReducer(state, letterTapped({ index: aIndex })); // a
    state = gameReducer(state, letterTapped({ index: tIndex })); // t
    state = gameReducer(state, letterTapped({ index: sIndex })); // s
    state = gameReducer(state, wordSubmitted());

    // Verify game completed with final round score
    expect(state.roundScore).toBe(130); // 30+30+30+40
    expect(state.totalScore).toBe(500); // Still unchanged
    
    // Check if game is complete
    const isComplete = state.answers.every(answer => answer.state === 'found');
    expect(isComplete).toBe(true);

    // Player starts a new game after completion - this should add round score to total score
    state = gameReducer(state, newGameAfterCompletion());

    // Verify total score now includes round score and round score is reset
    expect(state.totalScore).toBe(630); // 500 + 130
    expect(state.roundScore).toBe(0);
    expect(state.answers).toEqual([]); // Game state reset for new game

    // Simulate page refresh - cache should be loaded with both scores
    const expectedCacheState = {
      scrambledLetters: state.scrambledLetters,
      answers: state.answers,
      roundScore: 0,
      totalScore: 630
    };

    localStorageService.loadGameState.and.returnValue(expectedCacheState);

    // Restore from cache
    state = gameReducer(initialState, restoreStateFromCache({
      scrambledLetters: expectedCacheState.scrambledLetters,
      answers: expectedCacheState.answers,
      roundScore: expectedCacheState.roundScore,
      totalScore: expectedCacheState.totalScore
    }));

    // Verify both scores are correctly restored
    expect(state.roundScore).toBe(0);
    expect(state.totalScore).toBe(630);

    console.log('E2E Test Results:');
    console.log('Final Round Score:', state.roundScore);
    console.log('Final Total Score:', state.totalScore);
    console.log('Test completed successfully!');
  });

  it('should handle mid-game cache restore correctly', () => {
    // Simulate a game in progress that gets cached and restored
    let state: GameState = {
      ...initialState,
      roundScore: 0,
      totalScore: 200 // Existing total score
    };

    // Start game and make some progress
    state = gameReducer(state, newGameStarted({
      word: 'test',
      answers: ['set', 'test']
    }));

    // Player finds one word "set"
    const setS = state.scrambledLetters.findIndex(l => l.value === 's');
    const setE = state.scrambledLetters.findIndex(l => l.value === 'e');  
    const setT = state.scrambledLetters.findIndex(l => l.value === 't');
    
    state = gameReducer(state, letterTapped({ index: setS })); // s
    state = gameReducer(state, letterTapped({ index: setE })); // e
    state = gameReducer(state, letterTapped({ index: setT })); // t
    state = gameReducer(state, wordSubmitted());

    expect(state.roundScore).toBe(30); // "set" = 30 points
    expect(state.totalScore).toBe(200); // Unchanged

    // Simulate saving to cache (this should happen via effects in real app)
    const midGameCache = {
      scrambledLetters: state.scrambledLetters,
      answers: state.answers,
      roundScore: state.roundScore,
      totalScore: state.totalScore
    };

    // Simulate page refresh - restore from cache
    localStorageService.loadGameState.and.returnValue(midGameCache);
    
    const restoredState = gameReducer(initialState, restoreStateFromCache({
      scrambledLetters: midGameCache.scrambledLetters,
      answers: midGameCache.answers,
      roundScore: midGameCache.roundScore,
      totalScore: midGameCache.totalScore
    }));

    // Verify mid-game state is correctly restored
    expect(restoredState.roundScore).toBe(30);
    expect(restoredState.totalScore).toBe(200);
    expect(restoredState.answers.find(a => a.word === 'set')?.state).toBe('found');
    expect(restoredState.answers.find(a => a.word === 'test')?.state).toBe('not-found');

    console.log('Mid-game restore test completed successfully!');
  });
});