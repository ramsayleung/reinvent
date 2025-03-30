import { parse } from "../../regular_expression/parser";
import { Token, TokenKind } from "../../regular_expression/tokenizer";

describe('Parses correctly', () => {
  it('Parse the empty string', () => {
    expect(parse('')).toStrictEqual([]);
  })

  it('parses a single literal', () => {
    const expected: Token[] = [{
      kind: TokenKind.Lit, location: 0, value: 'a'
    }];
    expect(parse('a')).toStrictEqual(expected);
  })

  it('parses multiple literals', () => {
    const expected: Token[] = [{
      kind: TokenKind.Lit, location: 0, value: 'a'
    },
    { kind: TokenKind.Lit, location: 1, value: 'b' }
    ];

    expect(parse('ab')).toStrictEqual(expected);
  })

  it('parses alt of groups', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Alt, location: 1, left: {
          kind: TokenKind.Lit, location: 0, value: 'a'
        },
        right: {
          kind: TokenKind.Group, location: 2, end: 5,
          children: [
            { kind: TokenKind.Lit, location: 3, value: 'b' },
            { kind: TokenKind.Lit, location: 4, value: 'c' },
          ]
        }
      },
    ];
    expect(parse('a|(bc)')).toStrictEqual(expected);
  })
})
