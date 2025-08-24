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
}
