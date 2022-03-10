Promise.all([import("./words.en.js"), import("./littleWords.en.js")]).then(
  (results) => {
    const { WORDS: words } = results[0];
    const { WORDS: littleWords } = results[1];

    const pairs = words
      .map((word) => {
        const letters = Array.from(word);

        let subset = littleWords.filter((littleWord) => {
          const littleLetters = Array.from(littleWord);

          letters.forEach((letter) => {
            const i = littleLetters.indexOf(letter);

            if (i >= 0) {
              littleLetters.splice(i, 1);
            }
          });

          return littleLetters.length === 0;
        });

        // sort subset by ABC's, then length
        subset = subset.sort().sort((a, b) => a.length - b.length);

        // scramble the word
        word = Array.from(word)
          .sort(() => Math.random() - 0.5)
          .join("");

        return { word, subset };
      })
      .sort((a, b) => b.subset.length - a.subset.length)
      .filter((f) => f.subset.length >= 9 && f.subset.length <= 20);

    console.log(pairs);
  }
);
