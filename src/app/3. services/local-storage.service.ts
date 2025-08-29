import { Injectable } from '@angular/core';
import { GameState } from '../2. store/game/game.state';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'palabritas_game_state_v1';

  saveGameState(state: GameState): void {
    try {
      if (this.isLocalStorageAvailable()) {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(this.STORAGE_KEY, serializedState);
      } else {
        console.warn('LocalStorage is not available. Game state cannot be saved.');
      }
    } catch (error) {
      if (this.isQuotaExceededError(error)) {
        console.warn('LocalStorage quota exceeded. Game state cannot be saved.');
      } else {
        console.warn('Failed to save game state:', error);
      }
    }
  }

  loadGameState(): GameState | null {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn('LocalStorage is not available. Game state cannot be loaded.');
        return null;
      }

      const serializedState = localStorage.getItem(this.STORAGE_KEY);
      
      if (!serializedState) {
        return null;
      }

      const state = JSON.parse(serializedState) as GameState;
      
      if (!this.isValidGameState(state)) {
        console.warn('Invalid game state found in localStorage. Clearing stored data.');
        this.clearGameState();
        return null;
      }

      return state;
    } catch (error) {
      console.warn('Failed to load game state:', error);
      this.clearGameState();
      return null;
    }
  }

  clearGameState(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to clear game state:', error);
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private isQuotaExceededError(error: unknown): boolean {
    return error instanceof DOMException && (
      error.code === 22 ||
      error.code === 1014 ||
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    );
  }

  private isValidGameState(state: unknown): state is GameState {
    if (!state || typeof state !== 'object') {
      return false;
    }

    const gameState = state as Record<string, unknown>;

    if (!Array.isArray(gameState['answers']) ||
        !Array.isArray(gameState['scrambledLetters']) ||
        typeof gameState['score'] !== 'number') {
      return false;
    }

    const answers = gameState['answers'] as unknown[];
    for (const answer of answers) {
      if (!this.isValidAnswer(answer)) {
        return false;
      }
    }

    const letters = gameState['scrambledLetters'] as unknown[];
    for (const letter of letters) {
      if (!this.isValidLetter(letter)) {
        return false;
      }
    }

    return true;
  }

  private isValidAnswer(answer: unknown): boolean {
    if (!answer || typeof answer !== 'object') {
      return false;
    }

    const ans = answer as Record<string, unknown>;
    
    return typeof ans['word'] === 'string' &&
           Array.isArray(ans['letters']) &&
           (ans['state'] === 'found' || ans['state'] === 'not-found' || ans['state'] === 'revealed');
  }

  private isValidLetter(letter: unknown): boolean {
    if (!letter || typeof letter !== 'object') {
      return false;
    }

    const letterObj = letter as Record<string, unknown>;
    
    return typeof letterObj['value'] === 'string' &&
           typeof letterObj['index'] === 'number' &&
           (letterObj['typedIndex'] === undefined || typeof letterObj['typedIndex'] === 'number');
  }
}