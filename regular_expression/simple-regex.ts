export const match = (pattern: string, text: string): boolean => {
  // '^' at start of pattern matches start of next.
  if (pattern[0] === '^') {
    return matchHere(pattern, 1, text, 0);
  }

  // Try all possible starting points for pattern.
  let iText = 0;
  do {
    if (matchHere(pattern, 0, text, iText)) {
      return true;
    }
    iText += 1;
  } while (iText < text.length);

  // Nothing worked.
  return false;
}

const matchHere = (pattern: string, patternIndex: number, text: string, textIndex: number) => {
  // There is no more pattern to match.
  if (patternIndex === pattern.length) {
    return true;
  }

  // '$' at end of pattern matches end of text.
  if ((patternIndex === (pattern.length - 1)) && (pattern[patternIndex] === '$') && (textIndex === text.length)) {
    return true;
  }

  // '*' following current character means zero or more.
  if (((pattern.length - patternIndex) > 1) && (pattern[patternIndex + 1] === '*')) {
    // Try matching zero occurences(skip the current char and the '*')
    if (matchHere(pattern, patternIndex + 2, text, textIndex)) {
      return true;
    }

    // Try matching one or more occurences
    while ((textIndex < text.length) && (pattern[patternIndex] === '.' || text[textIndex] === pattern[patternIndex])) {
      // Try to match the rest of pattern after consuming this
      // character
      if (matchHere(pattern, patternIndex + 2, text, textIndex + 1)) {
        return true;
      }
      textIndex += 1;
    }
    // if there is any match, it will return early in the while loop,
    // so when reach this statement, it means nothing found.
    return false;
  }

  // Match a single chacater.
  if (textIndex < text.length && (pattern[patternIndex] === '.') || (pattern[patternIndex] === text[textIndex])) {
    return matchHere(pattern, patternIndex + 1, text, textIndex + 1);
  }

  // Nothing worked.
  return false;
}
