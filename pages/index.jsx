import Head from 'next/head';
import { useState } from 'react';
import Tile from '../components/tile';
import Answer from '../components/answer';
import InteractiveWord from '../components/interactiveWord';
import GameManager from '../lib/gameManager';

const gameManager = new GameManager();
const game = gameManager.nextGame();

function Home() {
    const [scramble, setScramble] = useState(makeTiles(game.word));
    const [entry, setEntry] = useState([]);
    const [answers, setAnswers] = useState(makeAnswers(game.subset));

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
                    <div className='answers-container'>
                        {answers.map((answer, i) => (
                            <Answer key={i} {...answer}></Answer>
                        ))}
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

            <footer>tarrball inc</footer>

            <style jsx global>{`
                html,
                body {
                    background: #222020;
                    padding: 0;
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

                .answers-container {
                    color: white;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    flex-wrap: wrap;
                    font-size: 18px;
                    height: 100px;
                    padding: 0.5em;
                }

                .answers-container > * {
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

                .score-container {
                    display: flex;
                    flex-direction: column;
                }

                .score-container span {
                    font-size: 0.5em;
                    margin-bottom: -4px;
                    margin-left: 3px;
                    opacity: 0.5;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
}

export default Home;
