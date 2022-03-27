import { GAMES } from './games.en';

export default class GameManager {
    #currentGame;

    nextGame() {
        this.#currentGame = GAMES[Math.floor(Math.random() * GAMES.length)];

        return this.#currentGame;
    }
}
