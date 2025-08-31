import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Answer, GameState, initialState } from 'src/app/2. store/game/game.state';
import { generateLetter } from 'src/app/4. shared/fakers/letter.faker';
import {
  letterTapped,
  newGameAfterCompletion,
  wordSubmitted,
  shuffleRequested,
} from 'src/app/2. store/game/game.actions';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameComponent, CommonModule],
      providers: [provideMockStore({ initialState: { game: initialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickLetter', () => {
    it('should dispatch letterTapped action with index', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.clickLetter(generateLetter(3));

      expect(dispatchSpy).toHaveBeenCalledWith(letterTapped({ index: 3 }));
    });
  });

  describe('clickEnter', () => {
    it('should dispatch wordSubmitted action when game is not complete', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.clickEnter(false);

      expect(dispatchSpy).toHaveBeenCalledWith(wordSubmitted());
    });

    it('should dispatch newGameRequested action when game is complete', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.clickEnter(true);

      expect(dispatchSpy).toHaveBeenCalledWith(newGameAfterCompletion());
    });
  });

  describe('clickShuffle', () => {
    it('should dispatch shuffleRequested action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.clickShuffle();

      expect(dispatchSpy).toHaveBeenCalledWith(shuffleRequested());
    });
  });

  describe('ngOnInit', () => {
    it('should not dispatch any actions (hydration system handles game initialization)', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    describe('recent answer changes', () => {
      let eleSpy: jasmine.Spy;
      let docSpy: jasmine.Spy;

      beforeEach(() => {
        const document = TestBed.inject(DOCUMENT);
        const element = document.createElement('div');

        docSpy = spyOn(document, 'getElementById').and.returnValue(element);
        eleSpy = spyOn(element, 'scrollIntoView');
      });

      it('should listen for answer changes and scroll to the most recent answer when a new answer is found', () => {
        const nextState: GameState = {
          ...initialState,
          mostRecentAnswer: 'test',
        };

        mockStore.setState({ game: nextState });

        expect(docSpy).toHaveBeenCalledWith('test');
        expect(eleSpy).toHaveBeenCalled();
      });

      it('should ignore undefined answers', () => {
        const nextState: GameState = {
          ...initialState,
          mostRecentAnswer: undefined,
        };

        mockStore.setState({ game: { ...nextState } });
        mockStore.setState({ game: { ...nextState } });
        mockStore.setState({ game: { ...nextState } });

        expect(docSpy).not.toHaveBeenCalled();
        expect(eleSpy).not.toHaveBeenCalled();
      });
    });

    describe('Animation Methods', () => {
      describe('getLetterAnimationDelay', () => {
        it('should return delay for matching recent answer', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const delay = component.getLetterAnimationDelay(answer, 2, 'TEST');
          expect(delay).toBe(400); // 200 + (2 * 100)
        });

        it('should return 0 for non-matching answer', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const delay = component.getLetterAnimationDelay(answer, 2, 'OTHER');
          expect(delay).toBe(0);
        });

        it('should return 0 for not-found state', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'not-found' };
          const delay = component.getLetterAnimationDelay(answer, 2, 'TEST');
          expect(delay).toBe(0);
        });

        it('should handle null recentAnswer', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const delay = component.getLetterAnimationDelay(answer, 2, null);
          expect(delay).toBe(0);
        });

        it('should handle undefined recentAnswer', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const delay = component.getLetterAnimationDelay(answer, 2, undefined);
          expect(delay).toBe(0);
        });
      });

      describe('shouldAnimateLetter', () => {
        it('should return true for matching recent answer with found state', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const result = component.shouldAnimateLetter(answer, 'TEST');
          expect(result).toBe(true);
        });

        it('should return true for matching recent answer with revealed state', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'revealed' };
          const result = component.shouldAnimateLetter(answer, 'TEST');
          expect(result).toBe(true);
        });

        it('should return false for non-matching answer', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const result = component.shouldAnimateLetter(answer, 'OTHER');
          expect(result).toBe(false);
        });

        it('should return false for not-found state', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'not-found' };
          const result = component.shouldAnimateLetter(answer, 'TEST');
          expect(result).toBe(false);
        });

        it('should handle null recentAnswer', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const result = component.shouldAnimateLetter(answer, null);
          expect(result).toBe(false);
        });

        it('should handle undefined recentAnswer', () => {
          const answer: Answer = { word: 'TEST', letters: ['T', 'E', 'S', 'T'], state: 'found' };
          const result = component.shouldAnimateLetter(answer, undefined);
          expect(result).toBe(false);
        });
      });
    });
  });
});
