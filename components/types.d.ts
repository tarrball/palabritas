interface AnswerProp {
    shouldScroll: boolean;
    wasFound: boolean;
    word: string;
}

interface TileProp {
    index: number;
    letter: string;
}

export { AnswerProp, TileProp };
