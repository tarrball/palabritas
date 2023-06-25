export interface Answer {
  word: string;
  letters: string[];
  isFound: boolean;
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
}

export const initialState: GameState = {
  answers: [],
  scrambledLetters: [],
  mostRecentAnswer: undefined,
};
