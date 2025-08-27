import {
  selectAnswers,
  selectClickableLetters,
  selectClickedLetters,
  selectEarnedPoints,
  selectIsGameComplete,
  selectMostRecentAnswer,
  selectPotentialPoints,
  selectScore,
  selectScrambledLetters,
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

    describe('selectScrambledLetters', () => {
      it('should select all scrambled letters from the state', () => {
        const result = selectScrambledLetters.projector(state);

        expect(result).toEqual(state.scrambledLetters);
        expect(result.length).toBeGreaterThan(0);
      });
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
        state.answers[0].state = 'found';
        state.answers[1].state = 'not-found';
        state.answers[2].state = 'found';
        state.answers[3].state = 'revealed';

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

  describe('selecting game state', () => {
    describe('selectIsGameComplete', () => {
      it('should return true when all answers are found', () => {
        const state = generateGameState(3);
        state.answers.forEach(answer => answer.state = 'found');

        const result = selectIsGameComplete.projector(state.answers);

        expect(result).toBe(true);
      });

      it('should return false when some answers are not found', () => {
        const state = generateGameState(3);
        state.answers[0].state = 'found';
        state.answers[1].state = 'not-found';
        state.answers[2].state = 'found';

        const result = selectIsGameComplete.projector(state.answers);

        expect(result).toBe(false);
      });

      it('should return false when there are no answers', () => {
        const result = selectIsGameComplete.projector([]);

        expect(result).toBe(false);
      });
    });

    describe('selectScore', () => {
      it('should select the total score from the state', () => {
        const state = generateGameState();
        state.totalScore = 250;

        const result = selectScore.projector(state);

        expect(result).toBe(250);
      });
    });
  });
});
