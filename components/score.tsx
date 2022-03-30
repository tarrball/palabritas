interface Props {
    label: string;
    score: number;
}

function Score({ label, score }: Props) {
    const paddedScore = score.toString().padStart(3, "0");

    return (
        <div>
            <label>{label}</label>
            <label>{paddedScore}</label>
            <style jsx>{`
                div {
                    display: flex;
                    flex-direction: column;
                    text-transform: uppercase;
                }

                label:first-child {
                    opacity: 0.5;
                }

                label:last-child {
                    font-size: 20px;
                }
            `}</style>
        </div>
    );
}

export default Score;
