import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  newGameRequested,
  revealGameRequested,
} from 'src/app/2. store/game/game.actions';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { initialState } from 'src/app/2. store/game/game.state';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideMockStore({ initialState: { game: initialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickNewGame', () => {
    it('should dispatch the newGameRequested action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.clickNewGame();

      expect(dispatchSpy).toHaveBeenCalledWith(newGameRequested());
    });
  });

  describe('revealAnswers', () => {
    it('should dispatch the revealGameRequested action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');

      component.revealAnswers();

      expect(dispatchSpy).toHaveBeenCalledWith(revealGameRequested());
    });
  });
});
