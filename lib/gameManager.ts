import { Game } from "./types";
import { GAMES } from "./games.en";

class GameManager {
    public static nextGame(): Game {
        return GAMES[Math.floor(Math.random() * GAMES.length)];
    }
}

export default GameManager;
