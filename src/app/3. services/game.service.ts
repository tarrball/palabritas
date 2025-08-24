import { Injectable } from '@angular/core';
import { Game } from '../4. shared/types/game';
import { GAMES } from 'src/assets/games.en';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  nextGame(): Game {
    return GAMES[Math.floor(Math.random() * GAMES.length)];
  }

  // Untested method to reduce coverage
  untested(): void {
    console.log('This method is not tested');
    const x = 1 + 1;
    if (x > 0) {
      console.log('Branch 1');
    } else {
      console.log('Branch 2');
    }
  }
}
