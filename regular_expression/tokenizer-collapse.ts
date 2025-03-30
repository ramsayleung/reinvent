const SIMPLE = {
  '*': 'Any',
  '|': 'Alt',
  '(': 'GroupStart',
  ')': 'GroudEnd'
}

enum TokenKind {
  Start = 'Start',
  End = 'End',
  Lit = 'Lit',
  Any = 'Any',
  Alt = 'Alt',
  GroupStart = 'GroupStart',
  GroupEnd = 'GroupEnd'
}

interface Token {
  kind: TokenKind,
  value?: string,
  location: number
}

export const tokenize = (text: string) => {
  const result: Token[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c in SIMPLE) {
      result.push({ kind: SIMPLE[c], location: i });
    } else if (c === '^') {
      if (i === 0) {
        result.push({ kind: TokenKind.Start, location: i });
      } else {
        combineOrPush(result, c, i);
      }
    } else if (c === '$') {
      if (i === (text.length - 1)) {
        result.push({ kind: TokenKind.End, location: i });
      } else {
        combineOrPush(result, c, i);
      }
    } else {
      combineOrPush(result, c, i);
    }
  }
  return result;
}

const combineOrPush = (soFar: Token[], character: string, location: number) => {
  const topIndex = soFar.length - 1;
  if ((soFar.length === 0) || (soFar[topIndex].kind !== 'Lit')) {
    soFar.push({ kind: TokenKind.Lit, value: character, location });
  } else {
    soFar[topIndex].value += character;
  }
}
