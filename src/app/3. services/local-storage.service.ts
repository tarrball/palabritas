import { Injectable } from '@angular/core';
import { Letter } from '../4. shared/types';

interface StoredAnswer {
  word: string;
  found: boolean;
  revealed: boolean;
}

interface CachedGameState {
  scrambledLetters: Letter[];
  answers: StoredAnswer[];
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'palabritas.game.state';

  saveGameState(scrambledLetters: Letter[], answers: StoredAnswer[], score: number): void {
    try {
      const state: CachedGameState = {
        scrambledLetters,
        answers,
        score,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save game state to localStorage:', error);
    }
  }

  loadGameState(): CachedGameState | null {
    try {
      const storedState = localStorage.getItem(this.STORAGE_KEY);
      if (!storedState) {
        return null;
      }

      const parsedState = JSON.parse(storedState) as CachedGameState;
      
      // Validate the structure
      if (
        !parsedState ||
        !Array.isArray(parsedState.scrambledLetters) ||
        !Array.isArray(parsedState.answers) ||
        typeof parsedState.score !== 'number'
      ) {
        this.clearGameState();
        return null;
      }

      return parsedState;
    } catch (error) {
      console.error('Failed to load game state from localStorage:', error);
      this.clearGameState();
      return null;
    }
  }

  clearGameState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear game state from localStorage:', error);
    }
  }
}