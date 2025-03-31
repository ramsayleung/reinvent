import { Token, TokenKind, tokenize } from "../../regular_expression/tokenizer";

describe('Tokenize correctly', () => {
  it('Tokenizes a single character', () => {
    const expectedToken: Token[] = [{
      kind: TokenKind.Lit, value: 'a', location: 0
    }];
    expect(tokenize('a')).toStrictEqual(expectedToken);
  })

  it('Tokenizes a sequence of characters', () => {
    const expectedToken: Token[] = [{
      kind: TokenKind.Lit, value: 'a', location: 0,
    }, {
      kind: TokenKind.Lit, value: 'b', location: 1,
    }
    ];
    expect(tokenize('ab')).toStrictEqual(expectedToken);
  })

  it('Tokenize start another alone', () => {
    const expectedToken: Token[] = [{
      kind: TokenKind.Start, location: 0
    }];
    expect(tokenize('^')).toStrictEqual(expectedToken);
  });

  it('Tokenizes start anchor followed by characters', () => {
    const expectedToken: Token[] = [{
      kind: TokenKind.Start, location: 0,
    }, {
      kind: TokenKind.Lit, value: 'a', location: 1,
    }
    ];
    expect(tokenize('^a')).toStrictEqual(expectedToken);
  })

  it('Tokenizes a complex expression', () => {
    const expectedToken: Token[] = [
      { kind: TokenKind.Start, location: 0 },
      { kind: TokenKind.Lit, location: 1, value: 'a' },
      { kind: TokenKind.Any, location: 2 },
      { kind: TokenKind.GroupStart, location: 3 },
      { kind: TokenKind.Lit, location: 4, value: 'b' },
      { kind: TokenKind.Lit, location: 5, value: 'c' },
      { kind: TokenKind.Lit, location: 6, value: 'd' },
      { kind: TokenKind.Alt, location: 7 },
      { kind: TokenKind.Lit, location: 8, value: 'e' },
      { kind: TokenKind.Lit, location: 9, value: '^' },
      { kind: TokenKind.GroupEnd, location: 10 },
      { kind: TokenKind.Any, location: 11 },
      { kind: TokenKind.Lit, location: 12, value: 'f' },
      { kind: TokenKind.Lit, location: 13, value: '$' },
      { kind: TokenKind.Lit, location: 14, value: 'g' },
      { kind: TokenKind.Lit, location: 15, value: 'h' },
      { kind: TokenKind.End, location: 16 }
    ];

    expect(tokenize('^a*(bcd|e^)*f$gh$')).toStrictEqual(expectedToken);
  })

  it('Tokenizes lazy any expression', () => {
    const expectedToken: Token[] = [{
      kind: TokenKind.Lit, value: 'a', location: 0,
    },

    {
      kind: TokenKind.Lit,
      value: 'b',
      location: 1
    },
    {
      kind: TokenKind.LazyAny, location: 2, end: 3
    }, {
      kind: TokenKind.Lit,
      value: 'c',
      location: 4
    }
    ];
    const actual = tokenize('ab*?c');
    expect(actual).toStrictEqual(expectedToken);
  })
})
