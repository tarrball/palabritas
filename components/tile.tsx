interface Props {
    value: string;
    onTap: () => void;
}

function Tile({ value, onTap }: Props) {
    return (
        <div>
            <button className="tile" onClick={onTap}>
                {value}
            </button>
            <style jsx>{`
                div {
                    flex: 1 1 0;
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
