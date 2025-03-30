import { parseToObject, parse } from "../../regular_expression/parser";
import { Token, TokenKind } from "../../regular_expression/tokenizer";
import Alt from '../../regular_expression/regex-alt';
import Any from '../../regular_expression/regex-any';
import End from '../../regular_expression/regex-end';
import Lit from '../../regular_expression/regex-lit';
import Start from '../../regular_expression/regex-start';
import Plus from '../../regular_expression/regex-plus';
import Opt from '../../regular_expression/regex-opt';
import AnyLazy from '../../regular_expression/regex-any-lazy';
import Group from '../../regular_expression/regex-group';
import { RegexBase } from "../../regular_expression/regex-base";

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

  it('parse a single literal to object', () => {
    expect(parseToObject('a')).toStrictEqual(Lit('a'));
  })

  it('parses multiple literals to object', () => {
    const expected: RegexBase = Lit('a', Lit('b'));
    expect(parseToObject('ab')).toStrictEqual(expected);
  })

  it('parses alt of groups to object', () => {
    const expected: RegexBase = Alt(Lit('a'), Group([Lit('b'), Lit('c')]));
    expect(parseToObject('a|(bc)')).toStrictEqual(expected);
  })
})
