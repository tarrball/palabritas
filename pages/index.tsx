import Answer from '../components/answer';
import GameManager from '../lib/gameManager';
import Grade from '../components/grade';
import Head from 'next/head';
import InteractiveWord from '../components/interactiveWord';
import Score from '../components/score';
import Tile from '../components/tile';
import { useRef, useState } from 'react';

const gameManager = new GameManager();
const game = gameManager.nextGame();

function Home() {
    const [scramble, setScramble] = useState(makeTiles(game.word));
    const [entry, setEntry] = useState([]);
    const [answers, setAnswers] = useState(makeAnswers(game.subset));
    const [lastAnswer, setLastAnswer] = useState('');
    const lastAnswerRef = useRef(null);

    function makeAnswers(answers) {
        if (!Number.isInteger(answers?.length)) {
            console.error(`Failed to create answers: '${answers}'`);

            return;
        }

        return answers.map((answer) => ({ word: answer, wasFound: false }));
    }

    function makeTiles(word) {
        if (typeof word !== 'string') {
            console.error(`Failed to create tiles: '${word}'`);

            return;
        }

        return Array.from(word).map((letter, i) => ({ letter, index: i }));
    }

    function popScramble(tile) {
        setScramble(scramble.filter((f) => f.index !== tile.index));
        setEntry(entry.concat(tile));
    }

    function popEntry(tile) {
        setEntry(entry.filter((f) => f.index !== tile.index));
        setScramble(scramble.concat(tile).sort((a, b) => a.index - b.index));
    }

    function tryEnterWord() {
        const word = entry.map((m) => m.letter).join('');
        const answerIndex = answers.findIndex(
            (f) => f.word === word && !f.wasFound
        );

        if (answerIndex >= 0) {
            answers[answerIndex].wasFound = true;
            const newScramble = scramble.concat(...entry);

            setAnswers(answers);
            setEntry([]);
            setScramble(newScramble.sort((a, b) => a.index - b.index));
            setLastAnswer(word);
        }
    }

    return (
        <div className='container'>
            <Head>
                <title>Palabs</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            {scramble ? (
                <main>
                    <div className='score-container'>
                        <Score label='Score' score='0'></Score>
                        <Grade max='300' score='0'></Grade>
                        <Score label='Max' score='300'></Score>
                    </div>

                    <div className='answers-container'>
                        {answers.map((answer, i) =>
                            answer.word === lastAnswer ? (
                                <Answer
                                    key={i}
                                    ref={lastAnswerRef}
                                    {...answer}
                                ></Answer>
                            ) : (
                                <Answer key={i} {...answer}></Answer>
                            )
                        )}
                    </div>

                    <div className='entry-container'>
                        <InteractiveWord
                            id='entry-box'
                            word={entry}
                            onTileTap={popEntry}
                        ></InteractiveWord>
                        <InteractiveWord
                            id='scramble-box'
                            word={scramble}
                            onTileTap={popScramble}
                        ></InteractiveWord>
                    </div>

                    <div className='enter-container'>
                        <Tile value='Enter ↵' onTap={tryEnterWord}></Tile>
                    </div>
                </main>
            ) : (
                <main></main>
            )}

            <footer>tarrball@palabs.app</footer>

            <style jsx global>{`
                html,
                body {
                    background: #222020;
                    color: white;
                    padding: 8px;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI,
                        Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
                        Helvetica Neue, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }

                main {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .answers-container {
                    display: flex;
                    font-size: 18px;
                    padding: 16px;
                    margin: 8px;
                    overflow-x: auto;
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }

                /* Hide scrollbar for Chrome, Safari and Opera */
                .answers-container::-webkit-scrollbar {
                    display: none;
                }

                .answers-container > * {
                }

                .score-container {
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                }

                .entry-container {
                    align-items: stretch;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
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
                }

                footer {
                    align-content: space-between;
                    align-items: flex-end;
                    color: white;
                    display: flex;
                    font-size: 3em;
                    justify-content: space-between;
                    margin-top: 1.5em;
                }
            `}</style>
        </div>
    );
}

export default Home;
