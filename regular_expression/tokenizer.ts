export enum TokenKind {
  Start = 'Start',
  End = 'End',
  Lit = 'Lit',
  Any = 'Any',
  Alt = 'Alt',
  Group = 'Group',
  GroupStart = 'GroupStart',
  GroupEnd = 'GroupEnd'
}

export interface Token {
  kind: TokenKind,
  location: number
  value?: string,               // for Alt
  left?: Token,                 // for Alt
  right?: Token,                // for Alt
  child?: Token,                // for Any
  end?: number,                 // for Group
  children?: Token[]            // for Group
}

const SIMPLE = {
  '*': TokenKind.Any,
  '|': TokenKind.Alt,
  '(': TokenKind.GroupStart,
  ')': TokenKind.GroupEnd
}

export const tokenize = (text: string) => {
  const result: Token[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i]
    if (c in SIMPLE) {
      result.push({ kind: SIMPLE[c], location: i });
    } else if ((c === '^') && (i === 0)) {
      result.push({ kind: TokenKind.Start, location: i });
    } else if ((c === '$') && (i === (text.length - 1))) {
      result.push({ kind: TokenKind.End, location: i });
    } else {
      result.push({ kind: TokenKind.Lit, location: i, value: c });
    }
  }
  return result;
}
