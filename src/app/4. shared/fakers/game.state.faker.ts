import { faker } from '@faker-js/faker';
import { GameState } from 'src/app/2. store/game/game.state';
import { generateLetter } from './letter.faker';
import { generateAnswer } from './answer.faker';

export function generateGameState(answerCount = 5): GameState {
  return {
    answers: Array.from({ length: answerCount }, generateAnswer),
    scrambledLetters: Array.from({ length: 6 }).map((_, i) =>
      generateLetter(i)
    ),
    mostRecentAnswer: faker.word.noun(),
    score: faker.number.int({ min: 0, max: 1000 }),
  };
}
