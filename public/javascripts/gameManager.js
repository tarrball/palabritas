// @flow

import { GAMES } from './games.en.js';

type Game = {
    word: string,
    subset: Array<string>,
};

export default class GameManager {
    #currentGame: Game;

    nextGame(): Game {
        this.#currentGame = GAMES[Math.floor(Math.random() * GAMES.length)];

        return this.#currentGame;
    }
}
