import { useEffect, useRef, useState } from "react";
import { AnswerProp } from "./types";

function Answer({ word, wasFound }: AnswerProp) {
    const labelRef = useRef<HTMLLabelElement>(null);

    let [wasScrolled, setWasScrolled] = useState(false);

    useEffect(() => {
        if (wasFound && !wasScrolled && labelRef?.current) {
            labelRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
            });

            setWasScrolled(true);
        }
    });

    return (
        <label ref={labelRef}>
            {wasFound ? word : "-".repeat(word.length)}
            <style jsx>{`
                label {
                    margin: 0 8px;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
            `}</style>
        </label>
    );
}

export default Answer;
