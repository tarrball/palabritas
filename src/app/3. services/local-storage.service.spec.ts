import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { State } from '../2. store';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const storageKey = 'palabs-app-state';

  const mockState: State = {
    game: {
      answers: [
        {
          word: 'TEST',
          letters: ['T', 'E', 'S', 'T'],
          state: 'found',
        },
      ],
      scrambledLetters: [
        { value: 'T', index: 0, typedIndex: undefined },
        { value: 'E', index: 1, typedIndex: undefined },
        { value: 'S', index: 2, typedIndex: undefined },
        { value: 'T', index: 3, typedIndex: undefined },
      ],
      mostRecentAnswer: 'TEST',
      score: 100,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveState', () => {
    it('should save state to localStorage and return true', () => {
      const result = service.saveState(mockState);

      expect(result).toBe(true);
      const storedValue = localStorage.getItem(storageKey);
      expect(storedValue).toBeTruthy();
      
      // Note: JSON.stringify/parse doesn't preserve undefined values - they are removed during serialization
      const parsedState = JSON.parse(storedValue!);
      expect(parsedState.game.answers).toEqual(mockState.game.answers);
      expect(parsedState.game.mostRecentAnswer).toEqual(mockState.game.mostRecentAnswer);
      expect(parsedState.game.score).toEqual(mockState.game.score);
      // Check scrambledLetters array - undefined typedIndex will be missing after serialization
      expect(parsedState.game.scrambledLetters).toHaveSize(4);
      expect(parsedState.game.scrambledLetters[0]).toEqual(jasmine.objectContaining({ value: 'T', index: 0 }));
      expect(parsedState.game.scrambledLetters[1]).toEqual(jasmine.objectContaining({ value: 'E', index: 1 }));
      expect(parsedState.game.scrambledLetters[2]).toEqual(jasmine.objectContaining({ value: 'S', index: 2 }));
      expect(parsedState.game.scrambledLetters[3]).toEqual(jasmine.objectContaining({ value: 'T', index: 3 }));
    });

    it('should overwrite existing state in localStorage', () => {
      const firstState: State = {
        game: {
          ...mockState.game,
          score: 50,
        },
      };

      service.saveState(firstState);
      const firstStoredValue = localStorage.getItem(storageKey);
      expect(JSON.parse(firstStoredValue!).game.score).toBe(50);

      service.saveState(mockState);
      const secondStoredValue = localStorage.getItem(storageKey);
      expect(JSON.parse(secondStoredValue!).game.score).toBe(100);
    });

    it('should return false if localStorage.setItem throws an error', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage quota exceeded');

      const result = service.saveState(mockState);

      expect(result).toBe(false);
    });
  });

  describe('getState', () => {
    it('should retrieve and deserialize state from localStorage', () => {
      localStorage.setItem(storageKey, JSON.stringify(mockState));

      const result = service.getState();

      // Note: JSON.stringify/parse doesn't preserve undefined values - they are removed during serialization
      expect(result).toBeTruthy();
      expect(result!.game.answers).toEqual(mockState.game.answers);
      expect(result!.game.mostRecentAnswer).toEqual(mockState.game.mostRecentAnswer);
      expect(result!.game.score).toEqual(mockState.game.score);
      // Check scrambledLetters array - undefined typedIndex will be missing after deserialization
      expect(result!.game.scrambledLetters).toHaveLength(4);
      expect(result!.game.scrambledLetters[0]).toEqual(jasmine.objectContaining({ value: 'T', index: 0 }));
      expect(result!.game.scrambledLetters[1]).toEqual(jasmine.objectContaining({ value: 'E', index: 1 }));
      expect(result!.game.scrambledLetters[2]).toEqual(jasmine.objectContaining({ value: 'S', index: 2 }));
      expect(result!.game.scrambledLetters[3]).toEqual(jasmine.objectContaining({ value: 'T', index: 3 }));
    });

    it('should return null if no state exists in localStorage', () => {
      const result = service.getState();

      expect(result).toBeNull();
    });

    it('should return null and clear localStorage if state cannot be deserialized', () => {
      localStorage.setItem(storageKey, 'invalid json {');

      const result = service.getState();

      expect(result).toBeNull();
      expect(localStorage.getItem(storageKey)).toBeNull();
    });

    it('should return null and clear localStorage if stored value is not valid JSON', () => {
      localStorage.setItem(storageKey, 'undefined');

      const result = service.getState();

      expect(result).toBeNull();
      expect(localStorage.getItem(storageKey)).toBeNull();
    });
  });
});