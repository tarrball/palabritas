function Tile({ value, onTap }) {
    return (
        <div>
            <button className='tile' onClick={onTap}>
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

                button:active, button:focus, button:hover {
                    background: #3330302b;
                    border-color: gray;
                }
            `}</style>
        </div>
    );
}

export default Tile;
