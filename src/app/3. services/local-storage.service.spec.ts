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
      const roundScore = 50;
      const totalScore = 100;

      service.saveGameState(scrambledLetters, answers, roundScore, totalScore);

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
      expect(parsedData.roundScore).toBe(roundScore);
      expect(parsedData.totalScore).toBe(totalScore);
    });

    it('should handle localStorage errors gracefully', () => {
      const scrambledLetters: Letter[] = [];
      const answers: Answer[] = [];
      const roundScore = 0;
      const totalScore = 0;

      spyOn(localStorage, 'setItem').and.throwError('Storage quota exceeded');
      spyOn(console, 'error');

      expect(() => service.saveGameState(scrambledLetters, answers, roundScore, totalScore)).not.toThrow();
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
        roundScore: 20,
        totalScore: 50,
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
        roundScore: storedState.roundScore,
        totalScore: storedState.totalScore,
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
        roundScore: 0,
        totalScore: 0,
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
        roundScore: 0,
        totalScore: 0,
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
        roundScore: 0,
        totalScore: 0,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
    });

    it('should return null and clear cache for invalid data structure - scores not numbers', () => {
      const invalidState = {
        scrambledLetters: [],
        answers: [],
        roundScore: 'not a number',
        totalScore: 'also not a number',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      spyOn(service, 'clearGameState');

      const loadedState = service.loadGameState();
      
      expect(loadedState).toBeNull();
      expect(service.clearGameState).toHaveBeenCalled();
    });

    it('should correctly convert revealed answers back to Answer format', () => {
      const storedState = {
        scrambledLetters: [
          { value: 'A', index: 0 },
          { value: 'B', index: 1 },
        ],
        answers: [
          { word: 'AB', found: false, revealed: true },
          { word: 'BA', found: false, revealed: false },
        ],
        roundScore: 0,
        totalScore: 0,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));

      const loadedState = service.loadGameState();
      
      expect(loadedState).toEqual({
        scrambledLetters: [
          { value: 'A', index: 0, typedIndex: undefined },
          { value: 'B', index: 1, typedIndex: undefined },
        ],
        answers: [
          { word: 'AB', letters: ['A', 'B'], state: 'revealed' },
          { word: 'BA', letters: ['B', 'A'], state: 'not-found' },
        ],
        roundScore: 0,
        totalScore: 0,
      });
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