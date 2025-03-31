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
  LazyAny = 'LazyAny',
  Escape = 'Escape'
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

const SYMBOL_TOKEN_TYPE_MAP = {
  '*': TokenKind.Any,
  '|': TokenKind.Alt,
  '+': TokenKind.Plus,
  '?': TokenKind.Opt,
  '(': TokenKind.GroupStart,
  ')': TokenKind.GroupEnd,
  '[': TokenKind.CharClassStart,
  ']': TokenKind.CharClassEnd,
  '\\': TokenKind.Escape
}

const TOKEN_TYPE_SYMBOL_MAP = Object.fromEntries(
  Object.entries(SYMBOL_TOKEN_TYPE_MAP).map(([key, value]) => [value, key])
);

export const tokenize = (text: string): Token[] => {
  const result: Token[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i]
    if (c in SYMBOL_TOKEN_TYPE_MAP) {
      result.push({ kind: SYMBOL_TOKEN_TYPE_MAP[c], location: i });
    } else if ((c === '^') && (i === 0)) {
      result.push({ kind: TokenKind.Start, location: i });
    } else if ((c === '$') && (i === (text.length - 1))) {
      result.push({ kind: TokenKind.End, location: i });
    } else {
      result.push({ kind: TokenKind.Lit, location: i, value: c });
    }
  }
  return compress(result);
}

const compress = (raw: Token[]): Token[] => {
  const cooked: Token[] = [];
  while (raw.length > 0) {
    let token = raw.pop();
    // interpret `*?` as a single token meaning "lazy match zero or more"
    if (token.kind === TokenKind.Any && cooked.length > 0 && cooked[0].kind === TokenKind.Opt) {
      const optToken = cooked.shift();
      const lazyAnyToken = token;
      lazyAnyToken.kind = TokenKind.LazyAny;
      lazyAnyToken.end = optToken.location;
      token = lazyAnyToken;
    } else if (token.kind === TokenKind.Escape && cooked.length > 0) {
      const literalizedToken = cooked.shift();
      if (literalizedToken.kind in TOKEN_TYPE_SYMBOL_MAP) {
        token = {
          kind: TokenKind.Lit,
          value: TOKEN_TYPE_SYMBOL_MAP[literalizedToken.kind],
          location: literalizedToken.location
        }
      }
    }

    cooked.unshift(token);
  }
  return cooked;
}
