interface Props {
    score: number;
    max: number;
}

function Grade({ score, max }: Props) {
    const grade = score / max;
    let text = "Palabs";

    if (grade === 1) {
        text = "Perfect!";
    } else if (grade > 0.85) {
        text = "Great";
    } else if (grade > 0.5) {
        text = "Good";
    }

    return (
        <div>
            <label>{text}</label>
            <style jsx>{`
                label {
                    font-size: 35px;
                    font-variant: small-caps;
                }
            `}</style>
        </div>
    );
}

export default Grade;
