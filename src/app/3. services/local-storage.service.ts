import { Injectable } from '@angular/core';
import { Letter } from '../4. shared/types';
import { Answer } from '../2. store/game/game.state';

// Internal storage format - not exported
interface StoredAnswer {
  word: string;
  found: boolean;
  revealed: boolean;
}

interface StoredGameState {
  scrambledLetters: Letter[];
  answers: StoredAnswer[];
  score: number;
}

// Public interface using domain types
export interface CachedGameState {
  scrambledLetters: Letter[];
  answers: Answer[];
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'palabritas.game.state';

  saveGameState(scrambledLetters: Letter[], answers: Answer[], score: number): void {
    try {
      // Convert Answer[] to StoredAnswer[] for storage
      const storedAnswers: StoredAnswer[] = answers.map(answer => ({
        word: answer.word,
        found: answer.state === 'found',
        revealed: answer.state === 'revealed'
      }));

      const state: StoredGameState = {
        scrambledLetters,
        answers: storedAnswers,
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

      const parsedState = JSON.parse(storedState) as StoredGameState;
      
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

      // Convert StoredAnswer[] back to Answer[]
      const answers: Answer[] = parsedState.answers.map(storedAnswer => ({
        word: storedAnswer.word,
        letters: Array.from(storedAnswer.word),
        state: storedAnswer.found ? 'found' : storedAnswer.revealed ? 'revealed' : 'not-found' as const
      }));

      // Ensure scrambledLetters have typedIndex property (even if undefined)
      const scrambledLetters: Letter[] = parsedState.scrambledLetters.map(letter => ({
        value: letter.value,
        index: letter.index,
        typedIndex: letter.typedIndex ?? undefined
      }));

      return {
        scrambledLetters,
        answers,
        score: parsedState.score
      };
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