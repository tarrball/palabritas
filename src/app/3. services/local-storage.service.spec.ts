import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { Letter } from '../4. shared/types';

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
      const answers = [
        { word: 'AB', found: true, revealed: false },
        { word: 'BA', found: false, revealed: true },
      ];
      const score = 100;

      service.saveGameState(scrambledLetters, answers, score);

      const storedData = localStorage.getItem(STORAGE_KEY);
      expect(storedData).toBeTruthy();
      
      const parsedData = JSON.parse(storedData!);
      expect(parsedData.scrambledLetters).toEqual(scrambledLetters);
      expect(parsedData.answers).toEqual(answers);
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
      const validState = {
        scrambledLetters: [
          { value: 'A', index: 0, typedIndex: undefined },
          { value: 'B', index: 1, typedIndex: undefined },
        ],
        answers: [
          { word: 'AB', found: true, revealed: false },
        ],
        score: 50,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(validState));

      const loadedState = service.loadGameState();
      expect(loadedState).toEqual(validState);
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