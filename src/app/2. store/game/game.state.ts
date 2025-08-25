export type AnswerState = 'found' | 'not-found' | 'revealed';

export interface Answer {
  word: string;
  letters: string[];
  state: AnswerState;
}

export interface Letter {
  value: string;
  index: number;
  typedIndex: number | undefined;
}

export interface TypedLetter extends Letter {
  typedIndex: number;
}

export interface GameState {
  answers: Answer[];
  scrambledLetters: Letter[];
  mostRecentAnswer: string | undefined;
  score: number;
}

export const initialState: GameState = {
  answers: [],
  scrambledLetters: [],
  mostRecentAnswer: undefined,
  score: 0,
};
