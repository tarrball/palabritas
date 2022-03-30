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
                    padding: 4px;
                }

                button {
                    background: #333030e8;
                    color: white;
                    cursor: pointer;
                    font-size: 170%;
                    font-weight: bold;
                    height: 50px;
                    min-width: 50px;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
}

export default Tile;
