import { INIT, select } from '@ngrx/store';
import { gameReducer } from './game.reducer';
import { GameState, initialState } from './game.state';
import {
  letterTapped,
  newGameRequested,
  newGameStarted,
  wordSubmitted,
} from './game.actions';
import { selectClickableLetters, selectClickedLetters } from './game.selectors';

describe('GameReducer', () => {
  describe('init action', () => {
    it('should return the initial state', () => {
      const nextState = gameReducer(undefined, { type: INIT });

      expect(nextState).toBe(initialState);
    });
  });

  describe('newGameRequested', () => {
    it('should return the same state', () => {
      const nextState = gameReducer(initialState, newGameRequested());

      expect(nextState).toBe(initialState);
    });
  });

  describe('newGameStarted', () => {
    let state: GameState;

    beforeEach(() => {
      state = gameReducer(
        initialState,
        newGameStarted({
          word: 'test',
          answers: ['set', 'test'],
        })
      );
    });

    it('should create answers on the state', () => {
      expect(state.answers).toEqual([
        {
          word: 'set',
          letters: ['s', 'e', 't'],
          isFound: false,
        },
        {
          word: 'test',
          letters: ['t', 'e', 's', 't'],
          isFound: false,
        },
      ]);
    });

    it('should create scrambledLetters on the state', () => {
      expect(state.scrambledLetters).toEqual([
        { value: 't', index: 0, typedIndex: undefined },
        { value: 'e', index: 1, typedIndex: undefined },
        { value: 's', index: 2, typedIndex: undefined },
        { value: 't', index: 3, typedIndex: undefined },
      ]);
    });
  });

  describe('game play', () => {
    let state: GameState;

    beforeEach(() => {
      state = gameReducer(
        initialState,
        newGameStarted({
          word: 'test',
          answers: ['set', 'test'],
        })
      );
    });

    describe('letterTapped', () => {
      it('should move clicked letters into the clicked array in order', () => {
        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[1].index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[2].index })
        );

        const clickableLetters = selectClickableLetters.projector(state);
        const clickedLetters = selectClickedLetters.projector(state);

        expect(clickableLetters.length).toEqual(2);
        expect(clickableLetters[0].value).toEqual('t');
        expect(clickableLetters[1].value).toEqual('t');

        expect(clickedLetters.length).toEqual(2);
        expect(clickedLetters[0].value).toEqual('e');
        expect(clickedLetters[1].value).toEqual('s');
      });

      it('should remove the letter from the clicked array if it is clicked again', () => {
        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[0].index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[2].index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[2].index })
        );

        const clickableLetters = selectClickableLetters.projector(state);
        const clickedLetters = selectClickedLetters.projector(state);

        expect(clickableLetters.length).toEqual(3);
        expect(clickableLetters[0].value).toEqual('e');
        expect(clickableLetters[1].value).toEqual('s');
        expect(clickableLetters[2].value).toEqual('t');

        expect(clickedLetters.length).toEqual(1);
        expect(clickedLetters[0].value).toEqual('t');
      });
    });

    describe('wordSubmitted', () => {
      beforeEach(() => {
        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[2].index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[1].index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[0].index })
        );
      });

      it('should mark the answer as found if the word is correct', () => {
        state = gameReducer(state, wordSubmitted());

        const foundAnswer = state.answers.filter(
          (answer) => answer.word === 'set'
        )[0];
        const remainingAnswer = state.answers.filter(
          (answer) => answer.word === 'test'
        )[0];

        expect(foundAnswer.isFound).toEqual(true);
        expect(remainingAnswer.isFound).toEqual(false);
      });

      it('should reset the clicked letters if the word is correct', () => {
        state = gameReducer(state, wordSubmitted());

        const clickedLetters = selectClickedLetters.projector(state);

        expect(clickedLetters.length).toEqual(0);
      });

      it('should reset the clicked letters if the word is incorrect', () => {
        state = gameReducer(
          state,
          letterTapped({ index: state.scrambledLetters[3].index })
        );

        state = gameReducer(state, wordSubmitted());

        const clickedLetters = selectClickedLetters.projector(state);

        expect(clickedLetters.length).toEqual(0);
      });
    });
  });
});
