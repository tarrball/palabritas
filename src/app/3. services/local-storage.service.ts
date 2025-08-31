import { Injectable } from '@angular/core';
import { State } from '../2. store';

/**
 * Service for managing application state persistence in local storage
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly storageKey = 'palabs-app-state';

  /**
   * Saves the application state to local storage
   * @param state The current application state to save
   * @returns true if the save was successful, false otherwise
   */
  saveState(state: State): boolean {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(this.storageKey, serializedState);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retrieves the application state from local storage
   * @returns The deserialized state object, or null if not found or deserialization fails
   */
  getState(): State | null {
    try {
      const serializedState = localStorage.getItem(this.storageKey);
      if (serializedState === null) {
        return null;
      }
      const state = JSON.parse(serializedState) as State;
      return state;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  /**
   * Clears the application state from local storage
   */
  clearState(): void {
    localStorage.removeItem(this.storageKey);
  }
}