import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, toArray } from 'rxjs';
import { GameService } from 'src/app/3. services/game.service';
import { GameEffects } from './game.effects';
import { initialState } from './game.state';
import { generateGame } from 'src/app/4. shared/fakers/game.faker';
import { newGameRequested, newGameStarted } from './game.actions';

describe('GameEffects', () => {
  let effects: GameEffects;
  let actions$: Observable<Action>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;

  beforeEach(() => {
    gameServiceSpy = jasmine.createSpyObj('GameService', ['nextGame']);

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        {
          provide: GameService,
          useValue: gameServiceSpy,
        },
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { game: initialState } }),
      ],
    });

    effects = TestBed.inject(GameEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('requestNewGame$', () => {
    it('should return newGameStarted action with nextGame from GameService', (done) => {
      actions$ = of(newGameRequested({ preserveScore: false }));

      const nextGame = generateGame();

      gameServiceSpy.nextGame.and.returnValue(nextGame);

      effects.requestNewGame$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([newGameStarted(nextGame)]);

        done();
      });
    });
  });
});
