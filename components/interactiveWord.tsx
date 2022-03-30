import Tile from "./tile";
import { TileProp } from "./types";

interface Props {
    word: TileProp[];
    onTileTap: (tile: TileProp) => void;
}

function InteractiveWord({ word, onTileTap }: Props) {
    return (
        <div>
            {word.map((tile) => (
                <Tile key={tile.index} value={tile.letter} onTap={() => onTileTap(tile)}></Tile>
            ))}
            <style jsx>{`
                div {
                    display: flex;
                    justify-content: center;
                    padding: 5px;
                }
            `}</style>
        </div>
    );
}

export default InteractiveWord;
