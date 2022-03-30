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
                    flex-basis: 16.6%;
                }

                button {
                    background: #333030e8;
                    color: white;
                    cursor: pointer;
                    display: inline-block;
                    font-size: 170%;
                    font-weight: bold;
                    height: 50px;
                    text-transform: uppercase;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}

export default Tile;
