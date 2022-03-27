function Grade({ score, max }) {
    const grade = score / max;
    let text = 'palabritas';

    if (grade === 1) {
        text = 'Perfect!';
    } else if (grade > 0.85) {
        text = 'Great';
    } else if (grade > 0.5) {
        text = 'Good';
    }

    return (
        <div>
            <label>{text}</label>
            <style jsx>{``}</style>
        </div>
    );
}

export default Grade;
