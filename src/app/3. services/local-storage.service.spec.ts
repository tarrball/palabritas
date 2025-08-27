import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { Letter } from '../4. shared/types';
import { Answer } from '../2. store/game/game.state';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const STORAGE_KEY = 'palabritas.game.state';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveGameState', () => {
    it('should save game state to localStorage', () => {
      const scrambledLetters: Letter[] = [
        { value: 'A', index: 0, typedIndex: undefined },
        { value: 'B', index: 1, typedIndex: undefined },
      ];
      const answers: Answer[] = [
        { word: 'AB', letters: ['A', 'B'], state: 'found' },
        { word: 'BA', letters: ['B', 'A'], state: 'revealed' },
      ];
      const score = 100;

      service.saveGameState(scrambledLetters, answers, score);

      const storedData = localStorage.getItem(STORAGE_KEY);
      expect(storedData).toBeTruthy();
      
      const parsedData = JSON.parse(storedData!);
      // Check scrambledLetters are stored as-is 
      // Note: JSON.stringify drops undefined values, so typedIndex won't be present
      expect(parsedData.scrambledLetters).toEqual([
        { value: 'A', index: 0 },
        { value: 'B', index: 1 },
      ]);
      // Check that answers are stored in the internal format
      expect(parsedData.answers).toEqual([
        { word: 'AB', found: true, revealed: false },
        { word: 'BA', found: false, revealed: true },
      ]);
      expect(parsedData.score).toBe(score);
    });

    it('should handle localStorage errors gracefully', () => {
      const scrambledLetters: Letter[] = [];
      const answers: Answer[] = [];
      const score = 0;

      spyOn(localStorage, 'setItem').and.throwError('Storage quota exceeded');
      spyOn(console, 'error');

      expect(() => service.saveGameState(scrambledLetters, answers, score)).not.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save game state to localStorage:',
        jasmine.any(Error)
      );
    });
  });

  describe('loadGameState', () => {
    it('should load valid game state from localStorage', () => {
      // Store in internal format (what gets saved to localStorage)
      // Note: We don't include typedIndex since JSON drops undefined values
      const storedState = {
        scrambledLetters: [
          { value: 'A', index: 0 },
          { value: 'B', index: 1 },
        ],
        answers: [
          { word: 'AB', found: true, revealed: false },
        ],
        score: 50,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));

      const loadedState = service.loadGameState();
      
      // Verify it returns the correct format
      // Note: The service adds typedIndex: undefined to scrambledLetters when loading
      expect(loadedState).toEqual({
        scrambledLetters: [
          { value: 'A', index: 0, typedIndex: undefined },
          { value: 'B', index: 1, typedIndex: undefined },
        ],
        answers: [
          { word: 'AB', letters: ['A', 'B'], state: 'found' },
        ],
        score: storedState.score,
      });
    });

    it('should return null when no state exists', () => {
      const loadedState = service.loadGameState();
      expect(loadedState).toBeNull();
    });

    it('should return null and clear cache for invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json {]');
      spyOn(console, 'error');
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to load game state from localStorage:',
        jasmine.any(Error)
      );
    });

    it('should return null and clear cache for invalid data structure - missing scrambledLetters', () => {
      const invalidState = {
        answers: [],
        score: 0,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
    });

    it('should return null and clear cache for invalid data structure - scrambledLetters not array', () => {
      const invalidState = {
        scrambledLetters: 'not an array',
        answers: [],
        score: 0,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
    });

    it('should return null and clear cache for invalid data structure - answers not array', () => {
      const invalidState = {
        scrambledLetters: [],
        answers: 'not an array',
        score: 0,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
    });

    it('should return null and clear cache for invalid data structure - score not number', () => {
      const invalidState = {
        scrambledLetters: [],
        answers: [],
        score: 'not a number',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
    });

    it('should handle localStorage access errors gracefully', () => {
      spyOn(localStorage, 'getItem').and.throwError('Access denied');
      spyOn(console, 'error');
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to load game state from localStorage:',
        jasmine.any(Error)
      );
    });
  });

  describe('clearGameState', () => {
    it('should remove game state from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'some data');
      
      service.clearGameState();
      
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'removeItem').and.throwError('Access denied');
      spyOn(console, 'error');

      expect(() => service.clearGameState()).not.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to clear game state from localStorage:',
        jasmine.any(Error)
      );
    });
  });
});