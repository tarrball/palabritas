import { useEffect, useRef } from 'react';

function Answer({ word, wasFound }) {
    const labelRef = useRef(null);

    let wasScrolled = false;

    useEffect(() => {
        if (labelRef && wasFound && !wasScrolled) {
            wasScrolled = true;
            labelRef.current.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
            });
        }
    });

    return (
        <label ref={labelRef}>
            {wasFound ? word : '-'.repeat(word.length)}
            <style jsx>{`
                label {
                    font-weight: bold;
                    letter-spacing: 5px;
                    margin: 0 4px;
                    text-transform: uppercase;
                }
            `}</style>
        </label>
    );
}

export default Answer;
