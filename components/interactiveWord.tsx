import Tile from './tile';

function InteractiveWord({ word, onTileTap }) {
    return (
        <div>
            {word.map((tile) => (
                <Tile
                    key={tile.index}
                    value={tile.letter}
                    onTap={() => onTileTap(tile)}
                ></Tile>
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
