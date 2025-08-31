import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GameState, initialState } from 'src/app/2. store/game/game.state';
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
  });
});
