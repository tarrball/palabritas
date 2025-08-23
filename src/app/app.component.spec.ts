import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { initialState } from './2. store/game/game.state';
import { provideMockStore } from '@ngrx/store/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideMockStore({ initialState: { game: initialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
