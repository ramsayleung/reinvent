export enum TokenKind {
  Start = 'Start',
  End = 'End',
  Lit = 'Lit',
  Any = 'Any',
  Alt = 'Alt',
  Plus = 'Plus',
  Opt = 'Opt',
  Group = 'Group',
  GroupStart = 'GroupStart',
  GroupEnd = 'GroupEnd',
  CharClass = 'CharClass',
  CharClassStart = 'CharClassStart',
  CharClassEnd = 'CharClassEnd',
  LazyAny = 'LazyAny'
}

export interface Token {
  kind: TokenKind,
  location: number
  value?: string,               // for Alt
  left?: Token,                 // for Alt
  right?: Token,                // for Alt
  child?: Token,                // for Any, Ops, Plus
  end?: number,                 // for Group
  children?: Token[]            // for Group
}

const SIMPLE = {
  '*': TokenKind.Any,
  '|': TokenKind.Alt,
  '+': TokenKind.Plus,
  '?': TokenKind.Opt,
  '(': TokenKind.GroupStart,
  ')': TokenKind.GroupEnd,
  '[': TokenKind.CharClassStart,
  ']': TokenKind.CharClassEnd
}

export const tokenize = (text: string): Token[] => {
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
  return interpretLazyAny(result);
}

// interpret `*?` as a single token meaning "lazy match zero or more"
const interpretLazyAny = (raw: Token[]): Token[] => {
  const cooked: Token[] = [];
  while (raw.length > 0) {
    let token = raw.pop();
    if (token.kind === TokenKind.Any && cooked.length > 0 && cooked[0].kind === TokenKind.Opt) {
      const optToken = cooked.shift();
      const lazyAnyToken = token;
      lazyAnyToken.kind = TokenKind.LazyAny;
      lazyAnyToken.end = optToken.location;
      token = lazyAnyToken;
    }
    cooked.unshift(token);
  }
  return cooked;
}
