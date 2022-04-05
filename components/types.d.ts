interface AnswerProp {
    shouldScroll: boolean;
    wasFound: boolean;
    wasRevealed: boolean;
    word: string;
}

interface TileProp {
    index: number;
    letter: string;
}

export { AnswerProp, TileProp };
