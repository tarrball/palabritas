import { faker } from '@faker-js/faker';
import { Letter } from 'src/app/2. store/game/game.state';

export function generateLetter(index: number): Letter {
  return {
    value: faker.string.alpha(),
    index,
    typedIndex: undefined,
  };
}
