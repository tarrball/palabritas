import { INIT } from '@ngrx/store';
import { gameReducer } from './game.reducer';
import { GameState, initialState } from './game.state';
import {
  letterTapped,
  newGameRequested,
  newGameAfterCompletion,
  newGameStarted,
  revealGameRequested,
  wordSubmitted,
  wordFound,
  wordNotFound,
  shuffleRequested,
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
    it('should reset state and reset score for fresh start', () => {
      const stateWithScore: GameState = {
        ...initialState,
        score: 150,
        answers: [{ word: 'test', letters: ['t', 'e', 's', 't'], state: 'found' }],
      };
      
      const nextState = gameReducer(stateWithScore, newGameRequested());

      expect(nextState.score).toBe(0);
      expect(nextState.answers).toEqual([]);
      expect(nextState.scrambledLetters).toEqual([]);
      expect(nextState.mostRecentAnswer).toBeUndefined();
    });
  });

  describe('newGameAfterCompletion', () => {
    it('should reset state but preserve score after game completion', () => {
      const stateWithScore: GameState = {
        ...initialState,
        score: 150,
        answers: [{ word: 'test', letters: ['t', 'e', 's', 't'], state: 'found' }],
      };
      
      const nextState = gameReducer(stateWithScore, newGameAfterCompletion());

      expect(nextState.score).toBe(150);
      expect(nextState.answers).toEqual([]);
      expect(nextState.scrambledLetters).toEqual([]);
      expect(nextState.mostRecentAnswer).toBeUndefined();
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
          state: 'not-found',
        },
        {
          word: 'test',
          letters: ['t', 'e', 's', 't'],
          state: 'not-found',
        },
      ]);
    });

    it('should create scrambledLetters on the state with shuffled letters', () => {
      expect(state.scrambledLetters.length).toBe(4);
      
      const letters = state.scrambledLetters.map(l => l.value).sort();
      expect(letters).toEqual(['e', 's', 't', 't']);
      
      state.scrambledLetters.forEach((letter, index) => {
        expect(letter.index).toBe(index);
        expect(letter.typedIndex).toBeUndefined();
      });
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
        const firstLetter = state.scrambledLetters[1];
        const secondLetter = state.scrambledLetters[2];
        
        state = gameReducer(
          state,
          letterTapped({ index: firstLetter.index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: secondLetter.index })
        );

        const clickableLetters = selectClickableLetters.projector(state);
        const clickedLetters = selectClickedLetters.projector(state);

        expect(clickableLetters.length).toEqual(2);
        
        const unclickedLetters = state.scrambledLetters.filter(
          l => l.typedIndex === undefined
        );
        expect(unclickedLetters.length).toEqual(2);

        expect(clickedLetters.length).toEqual(2);
        expect(clickedLetters[0].value).toEqual(firstLetter.value);
        expect(clickedLetters[1].value).toEqual(secondLetter.value);
      });

      it('should remove the letter from the clicked array if it is clicked again', () => {
        const firstLetter = state.scrambledLetters[0];
        const secondLetter = state.scrambledLetters[2];
        
        state = gameReducer(
          state,
          letterTapped({ index: firstLetter.index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: secondLetter.index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: secondLetter.index })
        );

        const clickableLetters = selectClickableLetters.projector(state);
        const clickedLetters = selectClickedLetters.projector(state);

        expect(clickableLetters.length).toEqual(3);
        
        const unclickedLetters = state.scrambledLetters.filter(
          l => l.typedIndex === undefined
        );
        expect(unclickedLetters.length).toEqual(3);

        expect(clickedLetters.length).toEqual(1);
        expect(clickedLetters[0].value).toEqual(firstLetter.value);
      });
    });

    describe('revealGameRequested', () => {
      it(`should reveal the remaining 'not-found' words and preserve score`, () => {
        // Find and click letters to spell 'test'
        const tLetters = state.scrambledLetters.filter(l => l.value === 't');
        const eLetter = state.scrambledLetters.find(l => l.value === 'e');
        const sLetter = state.scrambledLetters.find(l => l.value === 's');
        
        state = gameReducer(state, letterTapped({ index: tLetters[0].index }));
        state = gameReducer(state, letterTapped({ index: eLetter!.index }));
        state = gameReducer(state, letterTapped({ index: sLetter!.index }));
        state = gameReducer(state, letterTapped({ index: tLetters[1].index }));

        state = gameReducer(state, wordSubmitted());
        state = gameReducer(state, wordFound({ word: 'test' }));
        
        // Verify we earned points before revealing
        expect(state.score).toBeGreaterThan(0);
        
        state = gameReducer(state, revealGameRequested());

        expect(state.answers[0].state).toEqual('revealed');
        expect(state.answers[1].state).toEqual('found');
        expect(state.score).toBeGreaterThan(0); // Score should be preserved after reveal
      });
    });

    describe('wordSubmitted', () => {
      beforeEach(() => {
        // Find the letters for 'set' in the scrambled array
        const sLetter = state.scrambledLetters.find(l => l.value === 's');
        const eLetter = state.scrambledLetters.find(l => l.value === 'e');
        const tLetter = state.scrambledLetters.find(l => l.value === 't');
        
        state = gameReducer(
          state,
          letterTapped({ index: sLetter!.index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: eLetter!.index })
        );

        state = gameReducer(
          state,
          letterTapped({ index: tLetter!.index })
        );
      });

      it('should not change state (letters reset happens in wordFound/wordNotFound)', () => {
        const stateBefore = { ...state };
        state = gameReducer(state, wordSubmitted());

        // wordSubmitted is now a no-op - letters remain selected until wordFound/wordNotFound
        expect(state).toEqual(stateBefore);
        
        const clickedLetters = selectClickedLetters.projector(state);
        expect(clickedLetters.length).toEqual(3); // Letters still selected
      });
    });

    describe('wordFound', () => {
      beforeEach(() => {
        // Set up some clicked letters first
        const sLetter = state.scrambledLetters.find(l => l.value === 's');
        const eLetter = state.scrambledLetters.find(l => l.value === 'e');
        const tLetter = state.scrambledLetters.find(l => l.value === 't');
        
        state = gameReducer(state, letterTapped({ index: sLetter!.index }));
        state = gameReducer(state, letterTapped({ index: eLetter!.index }));
        state = gameReducer(state, letterTapped({ index: tLetter!.index }));
      });

      it('should mark the answer as found', () => {
        state = gameReducer(state, wordFound({ word: 'set' }));

        const foundAnswer = state.answers.filter(
          (answer) => answer.word === 'set'
        )[0];
        const remainingAnswer = state.answers.filter(
          (answer) => answer.word === 'test'
        )[0];

        expect(foundAnswer.state).toEqual('found');
        expect(remainingAnswer.state).toEqual('not-found');
      });

      it('should update the score when a word is found', () => {
        const initialScore = state.score;
        state = gameReducer(state, wordFound({ word: 'set' }));

        // 'set' has 3 letters, so score should increase by 30
        expect(state.score).toEqual(initialScore + 30);
      });

      it('should set the most recent answer', () => {
        state = gameReducer(state, wordFound({ word: 'test' }));

        expect(state.mostRecentAnswer).toEqual('test');
      });

      it('should reset the clicked letters', () => {
        state = gameReducer(state, wordFound({ word: 'set' }));

        const clickedLetters = selectClickedLetters.projector(state);
        expect(clickedLetters.length).toEqual(0);
      });

      it('should handle finding a word that does not exist in answers', () => {
        const stateBefore = { ...state };
        state = gameReducer(state, wordFound({ word: 'notfound' }));

        // State should remain unchanged except letters are reset
        expect(state.score).toEqual(stateBefore.score);
        expect(state.mostRecentAnswer).toEqual(stateBefore.mostRecentAnswer);
        
        const clickedLetters = selectClickedLetters.projector(state);
        expect(clickedLetters.length).toEqual(0); // Letters still get reset
      });
    });

    describe('wordNotFound', () => {
      beforeEach(() => {
        // Set up some clicked letters first
        const sLetter = state.scrambledLetters.find(l => l.value === 's');
        const eLetter = state.scrambledLetters.find(l => l.value === 'e');
        const tLetter = state.scrambledLetters.find(l => l.value === 't');
        
        state = gameReducer(state, letterTapped({ index: sLetter!.index }));
        state = gameReducer(state, letterTapped({ index: eLetter!.index }));
        state = gameReducer(state, letterTapped({ index: tLetter!.index }));
      });

      it('should reset the clicked letters but not change other state', () => {
        const stateBefore = { ...state };
        state = gameReducer(state, wordNotFound());

        // Verify other state remains unchanged
        expect(state.score).toEqual(stateBefore.score);
        expect(state.answers).toEqual(stateBefore.answers);
        expect(state.mostRecentAnswer).toEqual(stateBefore.mostRecentAnswer);
        
        // But letters should be reset
        const clickedLetters = selectClickedLetters.projector(state);
        expect(clickedLetters.length).toEqual(0);
      });
    });

    describe('shuffleRequested', () => {
      it('should shuffle the scrambled letters', () => {
        const initialOrder = state.scrambledLetters.map(l => l.value).join('');
        
        // Shuffle may produce the same order on first try (especially for short words)
        // so we may need to shuffle multiple times
        let shuffledState = state;
        let attempts = 0;
        const maxAttempts = 10;
        let newOrder = initialOrder;
        
        while (newOrder === initialOrder && attempts < maxAttempts) {
          shuffledState = gameReducer(shuffledState, shuffleRequested());
          newOrder = shuffledState.scrambledLetters.map(l => l.value).join('');
          attempts++;
        }
        
        // For words with more than 2 unique letters, we should get a different order
        if (initialOrder.length > 2) {
          expect(newOrder).not.toEqual(initialOrder);
        }
        
        // Verify all letters are still present
        const initialLetters = state.scrambledLetters.map(l => l.value).sort();
        const shuffledLetters = shuffledState.scrambledLetters.map(l => l.value).sort();
        expect(shuffledLetters).toEqual(initialLetters);
        
        // Verify indices are updated correctly
        shuffledState.scrambledLetters.forEach((letter, index) => {
          expect(letter.index).toBe(index);
        });
      });

      it('should preserve typed indices when shuffling', () => {
        // Tap a letter first
        const firstLetter = state.scrambledLetters[0];
        state = gameReducer(state, letterTapped({ index: firstLetter.index }));
        
        // Verify letter is tapped
        expect(state.scrambledLetters.find(l => l.index === firstLetter.index)?.typedIndex).toBeDefined();
        
        // Shuffle
        const shuffledState = gameReducer(state, shuffleRequested());
        
        // Verify the typed letter still has its typedIndex
        const tappedLetters = shuffledState.scrambledLetters.filter(l => l.typedIndex !== undefined);
        expect(tappedLetters.length).toBe(1);
      });
    });
  });
});
