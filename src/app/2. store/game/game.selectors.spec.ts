import {
  selectAnswers,
  selectClickableLetters,
  selectClickedLetters,
  selectEarnedPoints,
  selectMostRecentAnswer,
  selectPotentialPoints,
} from './game.selectors';
import { generateGameState } from 'src/app/4. shared/fakers/game.state.faker';
import { gameReducer } from './game.reducer';
import { letterTapped } from './game.actions';
import { GameState } from './game.state';

describe('GameSelectors', () => {
  describe('selecting answers', () => {
    describe('selectAnswers', () => {
      it('should select all answers in the current game', () => {
        const state = generateGameState();

        const result = selectAnswers.projector(state);

        expect(result).toEqual(state.answers);
      });
    });

    describe('selectMostRecentAnswer', () => {
      it('should select the most recent answer', () => {
        const mostRecentAnswer = 'test';
        const state: GameState = { ...generateGameState(), mostRecentAnswer };

        const result = selectMostRecentAnswer.projector(state);

        expect(result).toEqual(mostRecentAnswer);
      });
    });
  });

  describe('selecting letters', () => {
    let state: GameState;

    beforeEach(() => {
      state = generateGameState();

      state = gameReducer(
        state,
        letterTapped({ index: state.scrambledLetters[0].index })
      );

      state = gameReducer(
        state,
        letterTapped({ index: state.scrambledLetters[3].index })
      );
    });

    describe('selectClickableLetters', () => {
      it('should select all letters that have not been clicked yet', () => {
        const result = selectClickableLetters.projector(state);

        expect(result.length).toEqual(4);
        expect(result.find((letter) => letter.index === 0)).toBeUndefined();
        expect(result.find((letter) => letter.index === 3)).toBeUndefined();
      });
    });

    describe('selectClickedLetters', () => {
      it('should select all letters that have been clicked', () => {
        const result = selectClickedLetters.projector(state);

        expect(result.length).toEqual(2);
        expect(result[0]).toBe(state.scrambledLetters[0]);
        expect(result[1]).toBe(state.scrambledLetters[3]);
      });
    });
  });

  describe('selecting points', () => {
    describe('selectEarnedPoints', () => {
      it('should select the total points earned in the current game', () => {
        const state = generateGameState();
        state.answers[0].isFound = true;
        state.answers[2].isFound = true;

        const expectedPoints =
          Array.from(state.answers[0].word).length * 10 +
          Array.from(state.answers[2].word).length * 10;

        const result = selectEarnedPoints.projector(state.answers);

        expect(result).toEqual(expectedPoints);
      });

      it('should return 0 if no answers have been found', () => {
        const state = generateGameState();

        const result = selectEarnedPoints.projector(state.answers);

        expect(result).toEqual(0);
      });
    });

    describe('selectPotentialPoints', () => {
      it('should select the total points that can be earned in the current game', () => {
        const state = generateGameState(3);
        let expectedPoints = state.answers[0].word.length * 10;
        expectedPoints += state.answers[1].word.length * 10;
        expectedPoints += state.answers[2].word.length * 10;

        const result = selectPotentialPoints.projector(state.answers);

        expect(result).toEqual(expectedPoints);
      });
    });
  });
});
