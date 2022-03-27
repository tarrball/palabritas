function Answer({ word, wasFound }) {
    return (
        <div>
            <label>{wasFound ? word : '_'.repeat(word.length)}</label>
            <style jsx>{`
                label {
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
}

export default Answer;
