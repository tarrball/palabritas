import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GameState, initialState } from 'src/app/2. store/game/game.state';
import { generateLetter } from 'src/app/4. shared/fakers/letter.faker';
import {
  letterTapped,
  newGameRequested,
  wordSubmitted,
} from 'src/app/2. store/game/game.actions';
import { DOCUMENT } from '@angular/common';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent],
      providers: [provideMockStore({ initialState: { game: initialState } })],
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
    it('should dispatch wordSubmitted action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.clickEnter();

      expect(dispatchSpy).toHaveBeenCalledWith(wordSubmitted());
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch the newGameRequested action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(newGameRequested());
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
