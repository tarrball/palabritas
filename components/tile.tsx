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
                    align-items: center;
                    display: flex;
                    flex: 1 1 0;
                    justify-content: center;
                }
                
                div.letter {
                    max-width: 16.6%;
                }

                div.word {
                    max-width: 150px
                }

                button {
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    display: inline-block;
                    font-size: 200%;
                    font-weight: bold;
                    height: 50px;
                    padding-bottom: 2px;
                    text-transform: uppercase;
                    width: calc(100% - 8px);
                }
            `}</style>
        </div>
    );
}

export default Tile;
