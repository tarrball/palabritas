import Answer from "../components/answer";
import GameManager from "../lib/gameManager";
import Grade from "../components/grade";
import Head from "next/head";
import InteractiveWord from "../components/interactiveWord";
import Score from "../components/score";
import Tile from "../components/tile";
import { useState } from "react";
import { AnswerProp, TileProp } from "../components/types";

let game = GameManager.nextGame();

function Home() {
    const [scramble, setScramble] = useState<TileProp[]>(makeTiles(game.word));
    const [entry, setEntry] = useState<TileProp[]>([]);
    const [answers, setAnswers] = useState<AnswerProp[]>(makeAnswers(game.answers));
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(makeMaxScore(game.answers));

    function makeAnswers(answers: string[]): AnswerProp[] {
        return answers.map((answer) => ({ word: answer, wasFound: false }));
    }

    function makeMaxScore(answers: string[]): number {
        const charCount = answers.reduce((acc, x) => acc + x.length, 0);
        const maxScore = charCount * 10;

        return maxScore;
    }

    function makeTiles(word: string): TileProp[] {
        return Array.from(word).map((letter, i) => ({ letter, index: i }));
    }

    function popScramble(tile: TileProp) {
        setScramble(scramble.filter((f) => f.index !== tile.index));
        setEntry(entry.concat(tile));
    }

    function popEntry(tile: TileProp) {
        setEntry(entry.filter((f) => f.index !== tile.index));
        setScramble(scramble.concat(tile).sort((a, b) => a.index - b.index));
    }

    function tryEnterWord() {
        const word = entry.map((m) => m.letter).join("");
        const answerIndex = answers.findIndex((f) => f.word === word && !f.wasFound);

        if (answerIndex >= 0) {
            answers[answerIndex].wasFound = true;
            const newScramble = scramble.concat(...entry);

            setAnswers(answers);
            setEntry([]);
            setScramble(newScramble.sort((a, b) => a.index - b.index));
            setScore(score + word.length * 10);
        }
    }

    return (
        <div className="container">
            <Head>
                <title>Palabritas</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
            </Head>

            {scramble ? (
                <main>
                    <div className="score-container">
                        <Score label="Score" score={score}></Score>
                        <Grade max={maxScore} score={0}></Grade>
                        <Score label="Max" score={maxScore} align="right"></Score>
                    </div>

                    <div className="answers-container">
                        {answers.map((answer, i) => (
                            <Answer key={i} {...answer}></Answer>
                        ))}
                    </div>

                    <div className="entry-container">
                        <InteractiveWord word={entry} onTileTap={popEntry}></InteractiveWord>
                        <InteractiveWord word={scramble} onTileTap={popScramble}></InteractiveWord>
                    </div>

                    <div className="enter-container">
                        <Tile value="Enter" onTap={tryEnterWord}></Tile>
                    </div>
                </main>
            ) : (
                <main></main>
            )}

            <footer>
                <label>andrew@tarrball.com</label>

                <a href="https://github.com/tarrball/palabritas" target="_blank">
                    View on GitHub
                </a>
            </footer>

            <style jsx global>{`
                html,
                body {
                    background: #222020;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
                        Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }

                .container {
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                    height: 85vh;
                    margin: auto;
                    max-width: 500px;
                    width: 100%;
                }

                main {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    overflow: hidden;
                    width: 100%;
                }

                .answers-container {
                    align-items: center;
                    display: flex;
                    flex-grow: 1;
                    font-size: 32px;
                    padding: 16px 0;
                    margin: 8px 0;
                    overflow-x: auto;
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }

                /* Hide scrollbar for Chrome, Safari and Opera */
                .answers-container::-webkit-scrollbar {
                    display: none;
                }

                .score-container {
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                }

                .entry-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 100%;
                }

                .entry-container > * {
                    height: 100px;
                }

                .main-container > * {
                    min-height: 70px;
                    padding: 2px 0;
                }

                .enter-container {
                    align-items: center;
                    display: flex;
                    justify-content: flex-end;
                    padding: 4px;
                }

                footer {
                    align-items: center;
                    display: flex;
                    font-variant: small-caps;
                    justify-content: space-between;
                    padding: 16px;
                    width: 100%;
                }

                footer a,
                footer a:active,
                footer a:hover,
                footer a:visited {
                    color: white;
                }
            `}</style>
        </div>
    );
}

export default Home;
