import { GAMES } from './games.en.js';

export default class GameManager {
    #currentGame;

    nextGame() {
        this.#currentGame = GAMES[Math.floor(Math.random() * (GAMES.length - 1))];

        return this.#currentGame;
    }
}
