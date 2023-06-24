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

export interface GameState {
  answers: Answer[];
  scrambedLetters: Letter[];
  mostRecentAnswer: string | undefined;
}

export const initialState: GameState = {
  answers: [],
  scrambedLetters: [],
  mostRecentAnswer: undefined,
};
