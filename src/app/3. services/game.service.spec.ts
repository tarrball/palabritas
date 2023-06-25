import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('nextGame', () => {
    it('should return a random game', () => {
      const game = service.nextGame();

      expect(game.word).toBeTruthy();
      expect(game.answers.length).toBeGreaterThan(0);
    });
  });
});
