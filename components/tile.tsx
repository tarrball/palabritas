interface Props {
    value: string;
    onTap: () => void;
}

function Tile({ value, onTap }: Props) {
    return (
        <div className={value.length === 1 ? 'letter' : 'word'}>
            <button className="tile" onClick={onTap}>
                {value}
            </button>
            <style jsx>{`
                div {
                    flex: 1 1 0;
                }
                
                div.letter {
                    max-width: 16.6%;
                }

                div.word {
                    max-width: 150px
                }

                button {
                    background: #333030e8;
                    color: white;
                    cursor: pointer;
                    display: inline-block;
                    font-size: 170%;
                    font-weight: bold;
                    height: 50px;
                    padding: 4px;
                    text-transform: uppercase;
                    width: calc(100% - 8px);
                }
            `}</style>
        </div>
    );
}

export default Tile;
