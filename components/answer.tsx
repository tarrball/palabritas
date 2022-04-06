import { AnswerProp } from './types';
import { useEffect, useRef, useState } from 'react';

function Answer({ word, wasFound, wasRevealed = false }: AnswerProp) {
    const labelRef = useRef<HTMLLabelElement>(null);

    let [wasScrolled, setWasScrolled] = useState(false);

    if (!wasRevealed && wasFound && !wasScrolled) {
        console.log('1');
        useEffect(() => {
            if (labelRef?.current) {
                labelRef.current.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                });

                setWasScrolled(true);
            }
        });
    }

    return (
        <label className={wasRevealed ? 'revealed' : ''} ref={labelRef}>
            {wasFound ? word : '-'.repeat(word.length)}
            <style jsx>{`
                label {
                    margin: 0 8px;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                label.revealed {
                    opacity: 0.35;
                }
            `}</style>
        </label>
    );
}

export default Answer;
