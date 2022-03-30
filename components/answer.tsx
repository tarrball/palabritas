import { useEffect, useRef } from "react";
import { AnswerProp } from "./types";

function Answer({ word, wasFound }: AnswerProp) {
    const labelRef = useRef<HTMLLabelElement>(null);

    let wasScrolled = false;

    useEffect(() => {
        if (labelRef?.current && wasFound && !wasScrolled) {
            wasScrolled = true;

            console.log("scrolling...");

            labelRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
            });
        }
    });

    return (
        <label ref={labelRef}>
            {wasFound ? word : "-".repeat(word.length)}
            <style jsx>{`
                label {
                    font-weight: bold;
                    letter-spacing: 5px;
                    margin: 0 4px;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
            `}</style>
        </label>
    );
}

export default Answer;
