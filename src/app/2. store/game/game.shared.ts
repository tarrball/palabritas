import { Letter, TypedLetter } from './game.state';

export function getTypedLetters(letters: Letter[]): TypedLetter[] {
  return letters
    .filter(typedLetterFilter)
    .map(typedLetterMap)
    .sort(typedLetterSort);
}

export function typedLetterFilter(letter: Letter): boolean {
  return letter.typedIndex !== undefined;
}

export function typedLetterMap(letter: Letter): TypedLetter {
  // You cannot map an letter without a typed index to a TypedLetter
  return { ...letter, typedIndex: letter.typedIndex! };
}

export function typedLetterSort(a: TypedLetter, b: TypedLetter): number {
  return a.typedIndex - b.typedIndex;
}
