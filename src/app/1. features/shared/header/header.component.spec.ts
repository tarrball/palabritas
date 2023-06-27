import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { newGameRequested } from 'src/app/2. store/game/game.actions';
import { MatToolbar } from '@angular/material/toolbar';
import { MockComponents, MockDirectives } from 'ng-mocks';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { initialState } from 'src/app/2. store/game/game.state';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        MockComponents(MatIcon, MatMenu, MatToolbar),
        MockDirectives(MatMenuTrigger),
      ],
      providers: [provideMockStore({ initialState: { game: initialState } })],
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
});
