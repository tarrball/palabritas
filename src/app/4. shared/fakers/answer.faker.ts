import { faker } from '@faker-js/faker';
import { Answer } from 'src/app/2. store/game/game.state';

export function generateAnswer(): Answer {
  const word = faker.word.noun();

  return {
    word,
    letters: Array.from({ length: word.length }, faker.string.alpha),
    state: 'not-found',
  };
}
