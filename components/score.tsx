interface Props {
    label: string;
    score: number;
    align?: string;
}

function Score({ label, score, align = 'left' }: Props) {
    const paddedScore = score.toString().padStart(3, "0");

    return (
        <div className={align === 'right' ? 'right' : ''}>
            <label>{label}</label>
            <label>{paddedScore}</label>
            <style jsx>{`
                div {
                    display: flex;
                    flex-direction: column;
                    font-variant: small-caps;
                }

                div.right {
                    align-items: flex-end;
                }

                label:first-child {
                    font-size: 23px;
                    opacity: 0.5;
                }

                label:last-child {
                    font-size: 30px;
                }
            `}</style>
        </div>
    );
}

export default Score;
