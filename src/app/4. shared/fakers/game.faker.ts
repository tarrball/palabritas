import { faker } from '@faker-js/faker';
import { Game } from '../types/game';

export function generateGame(): Game {
  return {
    word: faker.word.noun(6),
    answers: Array.from({ length: 5 }, faker.word.noun),
  };
}
