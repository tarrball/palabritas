import { useEffect, useRef } from 'react';

function Answer({ word, wasFound }) {
    return (
        <label>
            {wasFound ? word : '_'.repeat(word.length)}
            <style jsx>{`
                label {
                    letter-spacing: 2px;
                    margin: 0 4px;
                    text-transform: uppercase;
                }
            `}</style>
        </label>
    );
}

export default Answer;
