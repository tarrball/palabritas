import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { GameState } from '../2. store/game/game.state';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let localStorageMock: Storage;
  
  const validGameState: GameState = {
    answers: [
      { word: 'test', letters: ['t', 'e', 's', 't'], state: 'found' },
      { word: 'word', letters: ['w', 'o', 'r', 'd'], state: 'not-found' }
    ],
    scrambledLetters: [
      { value: 'a', index: 0, typedIndex: undefined },
      { value: 'b', index: 1, typedIndex: 2 }
    ],
    mostRecentAnswer: 'test',
    score: 100
  };

  beforeEach(() => {
    localStorageMock = {
      length: 0,
      clear: jasmine.createSpy('clear'),
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      key: jasmine.createSpy('key'),
      removeItem: jasmine.createSpy('removeItem'),
      setItem: jasmine.createSpy('setItem')
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  describe('saveGameState', () => {
    it('should save valid game state to localStorage', () => {
      service.saveGameState(validGameState);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'palabritas_game_state_v1',
        JSON.stringify(validGameState)
      );
    });

    it('should handle localStorage not available', () => {
      spyOn(console, 'warn');
      (localStorageMock.setItem as jasmine.Spy).and.throwError('localStorage not available');
      
      service.saveGameState(validGameState);

      expect(console.warn).toHaveBeenCalledWith('LocalStorage is not available. Game state cannot be saved.');
    });

    it('should handle quota exceeded error', () => {
      spyOn(console, 'warn');
      const quotaError = new DOMException('QuotaExceededError');
      Object.defineProperty(quotaError, 'name', { value: 'QuotaExceededError' });
      (localStorageMock.setItem as jasmine.Spy).and.throwError(quotaError);

      service.saveGameState(validGameState);

      expect(console.warn).toHaveBeenCalledWith('LocalStorage quota exceeded. Game state cannot be saved.');
    });

    it('should handle other save errors', () => {
      spyOn(console, 'warn');
      (localStorageMock.setItem as jasmine.Spy).and.throwError('Some other error');

      service.saveGameState(validGameState);

      expect(console.warn).toHaveBeenCalledWith('Failed to save game state:', jasmine.any(Error));
    });
  });

  describe('loadGameState', () => {
    it('should load valid game state from localStorage', () => {
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(validGameState));

      const result = service.loadGameState();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('palabritas_game_state_v1');
      expect(result).toEqual(validGameState);
    });

    it('should return null when no state is stored', () => {
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(null);

      const result = service.loadGameState();

      expect(result).toBeNull();
    });

    it('should handle localStorage not available', () => {
      spyOn(console, 'warn');
      (localStorageMock.getItem as jasmine.Spy).and.throwError('localStorage not available');

      const result = service.loadGameState();

      expect(console.warn).toHaveBeenCalledWith('LocalStorage is not available. Game state cannot be loaded.');
      expect(result).toBeNull();
    });

    it('should handle invalid JSON and clear state', () => {
      spyOn(console, 'warn');
      (localStorageMock.getItem as jasmine.Spy).and.returnValue('invalid json');

      const result = service.loadGameState();

      expect(console.warn).toHaveBeenCalledWith('Failed to load game state:', jasmine.any(Error));
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('palabritas_game_state_v1');
      expect(result).toBeNull();
    });

    it('should handle invalid game state structure', () => {
      spyOn(console, 'warn');
      const invalidState = { invalid: 'structure' };
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(invalidState));

      const result = service.loadGameState();

      expect(console.warn).toHaveBeenCalledWith('Invalid game state found in localStorage. Clearing stored data.');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('palabritas_game_state_v1');
      expect(result).toBeNull();
    });

    it('should reject state with invalid answers', () => {
      spyOn(console, 'warn');
      const invalidState = {
        ...validGameState,
        answers: [{ word: 123 as unknown as string, letters: [], state: 'found' as const }]
      };
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(invalidState));

      const result = service.loadGameState();

      expect(console.warn).toHaveBeenCalledWith('Invalid game state found in localStorage. Clearing stored data.');
      expect(result).toBeNull();
    });

    it('should reject state with invalid answer state', () => {
      spyOn(console, 'warn');
      const invalidState = {
        ...validGameState,
        answers: [{ word: 'test', letters: ['t'], state: 'invalid' as unknown as 'found' }]
      };
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(invalidState));

      const result = service.loadGameState();

      expect(console.warn).toHaveBeenCalledWith('Invalid game state found in localStorage. Clearing stored data.');
      expect(result).toBeNull();
    });

    it('should reject state with invalid scrambled letters', () => {
      spyOn(console, 'warn');
      const invalidState = {
        ...validGameState,
        scrambledLetters: [{ value: 123 as unknown as string, index: 0, typedIndex: undefined }]
      };
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(invalidState));

      const result = service.loadGameState();

      expect(console.warn).toHaveBeenCalledWith('Invalid game state found in localStorage. Clearing stored data.');
      expect(result).toBeNull();
    });

    it('should reject state with invalid score', () => {
      spyOn(console, 'warn');
      const invalidState = {
        ...validGameState,
        score: 'invalid'
      };
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(invalidState));

      const result = service.loadGameState();

      expect(console.warn).toHaveBeenCalledWith('Invalid game state found in localStorage. Clearing stored data.');
      expect(result).toBeNull();
    });

    it('should accept state with undefined mostRecentAnswer', () => {
      const stateWithUndefined: GameState = {
        ...validGameState,
        mostRecentAnswer: undefined
      };
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(stateWithUndefined));

      const result = service.loadGameState();

      expect(result).toEqual(stateWithUndefined);
    });

    it('should accept letters with undefined typedIndex', () => {
      const stateWithUndefinedTypedIndex: GameState = {
        ...validGameState,
        scrambledLetters: [
          { value: 'a', index: 0, typedIndex: undefined },
          { value: 'b', index: 1, typedIndex: undefined }
        ]
      };
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(stateWithUndefinedTypedIndex));

      const result = service.loadGameState();

      expect(result).toEqual(stateWithUndefinedTypedIndex);
    });
  });

  describe('clearGameState', () => {
    it('should remove game state from localStorage', () => {
      service.clearGameState();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('palabritas_game_state_v1');
    });

    it('should handle localStorage not available', () => {
      spyOn(console, 'warn');
      (localStorageMock.removeItem as jasmine.Spy).and.throwError('localStorage not available');

      service.clearGameState();

      expect(console.warn).toHaveBeenCalledWith('Failed to clear game state:', jasmine.any(Error));
    });
  });

  describe('localStorage availability check', () => {
    it('should correctly detect when localStorage is available', () => {
      service.saveGameState(validGameState);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle localStorage test failure', () => {
      spyOn(console, 'warn');
      let callCount = 0;
      (localStorageMock.setItem as jasmine.Spy).and.callFake(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Test failed');
        }
      });

      service.saveGameState(validGameState);

      expect(console.warn).toHaveBeenCalledWith('LocalStorage is not available. Game state cannot be saved.');
    });
  });

  describe('edge cases', () => {
    it('should handle empty game state', () => {
      const emptyState: GameState = {
        answers: [],
        scrambledLetters: [],
        mostRecentAnswer: undefined,
        score: 0
      };

      service.saveGameState(emptyState);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'palabritas_game_state_v1',
        JSON.stringify(emptyState)
      );
    });

    it('should handle large game state', () => {
      const largeState: GameState = {
        answers: Array(100).fill(null).map((_, i) => ({
          word: `word${i}`,
          letters: ['a', 'b', 'c', 'd'],
          state: 'found' as const
        })),
        scrambledLetters: Array(50).fill(null).map((_, i) => ({
          value: String.fromCharCode(65 + (i % 26)),
          index: i,
          typedIndex: i % 2 === 0 ? i : undefined
        })),
        mostRecentAnswer: 'test',
        score: 10000
      };

      service.saveGameState(largeState);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'palabritas_game_state_v1',
        JSON.stringify(largeState)
      );
    });

    it('should handle all answer states', () => {
      const stateWithAllAnswerStates: GameState = {
        answers: [
          { word: 'found', letters: ['f', 'o', 'u', 'n', 'd'], state: 'found' },
          { word: 'notfound', letters: ['n', 'o', 't'], state: 'not-found' },
          { word: 'revealed', letters: ['r', 'e', 'v'], state: 'revealed' }
        ],
        scrambledLetters: [],
        mostRecentAnswer: undefined,
        score: 0
      };

      service.saveGameState(stateWithAllAnswerStates);
      (localStorageMock.getItem as jasmine.Spy).and.returnValue(JSON.stringify(stateWithAllAnswerStates));

      const loaded = service.loadGameState();

      expect(loaded).toEqual(stateWithAllAnswerStates);
    });
  });
});