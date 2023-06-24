export interface Answer {
  word: string;
  isRevealed: boolean;
}

export interface Letter {
  value: string;
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
