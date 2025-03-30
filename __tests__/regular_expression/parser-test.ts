import { compile, parse } from "../../regular_expression/parser";
import { Token, TokenKind } from "../../regular_expression/tokenizer";
import Alt from '../../regular_expression/regex-alt';
import Any from '../../regular_expression/regex-any';
import End from '../../regular_expression/regex-end';
import Lit from '../../regular_expression/regex-lit';
import Start from '../../regular_expression/regex-start';
import CharClass from '../../regular_expression/regex-charclass';
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
    expect(compile('a')).toStrictEqual(Lit('a'));
  })

  it('parses multiple literals to object', () => {
    const expected: RegexBase = Lit('a', Lit('b'));
    expect(compile('ab')).toStrictEqual(expected);
  })

  it('parses alt of groups to object', () => {
    const expected: RegexBase = Alt(Lit('a'), Group([Lit('b'), Lit('c')]));
    expect(compile('a|(bc)')).toStrictEqual(expected);
  })
  it('parses Any (*) quantifier', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Any,
        location: 1,
        child: { kind: TokenKind.Lit, location: 0, value: 'a' }
      }
    ];
    expect(parse('a*')).toStrictEqual(expected);
  });

  it('parses Any `*` quantifier to object', () => {
    expect(compile('a*')).toStrictEqual(Any(Lit('a')));
  });

  it('parses Opt `?` quantifier', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Opt,
        location: 1,
        child: { kind: TokenKind.Lit, location: 0, value: 'a' }
      }
    ];
    expect(parse('a?')).toStrictEqual(expected);
  });

  it('parses Opt `?` quantifier to object', () => {
    expect(compile('a?')).toStrictEqual(Opt(Lit('a')));
  });

  it('parses Plus `+` quantifier', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Plus,
        location: 1,
        child: { kind: TokenKind.Lit, location: 0, value: 'a' }
      }
    ];
    expect(parse('a+')).toStrictEqual(expected);
  });

  it('parses Plus `+` quantifier to object', () => {
    expect(compile('a+')).toStrictEqual(Plus(Lit('a')));
  });

  it('parses nested quantifiers `a*?`', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Opt,
        location: 2,
        child: {
          kind: TokenKind.Any,
          location: 1,
          child: { kind: TokenKind.Lit, location: 0, value: 'a' }
        }
      }
    ];
    expect(parse('a*?')).toStrictEqual(expected);
  });

  it('parses nested quantifiers to object `a*?`', () => {
    expect(compile('a*?')).toStrictEqual(Opt(Any(Lit('a'))));
  });

  it('parses quantifiers with groups `(ab)+`', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Plus,
        location: 4,
        child: {
          kind: TokenKind.Group,
          location: 0,
          end: 3,
          children: [
            { kind: TokenKind.Lit, location: 1, value: 'a' },
            { kind: TokenKind.Lit, location: 2, value: 'b' }
          ]
        }
      }
    ];
    expect(parse('(ab)+')).toStrictEqual(expected);
  });

  it('parses quantifiers with groups to object `(ab)+`', () => {
    expect(compile('(ab)+')).toStrictEqual(
      Plus(Group([Lit('a'), Lit('b')]))
    );
  });

  it('parses Alt `|` with quantifiers `a|b*`', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Alt,
        location: 1,
        left: { kind: TokenKind.Lit, location: 0, value: 'a' },
        right: {
          kind: TokenKind.Any,
          location: 3,
          child: { kind: TokenKind.Lit, location: 2, value: 'b' }
        }
      }
    ];
    expect(parse('a|b*')).toStrictEqual(expected);
  });

  it('parses Alt `|` with quantifiers to object `a|b*`', () => {
    expect(compile('a|b*')).toStrictEqual(
      Alt(Lit('a'), Any(Lit('b')))
    );
  });

  it('parses complex combination `a(b|c)?d+`', () => {
    const expected: Token[] = [
      { kind: TokenKind.Lit, location: 0, value: 'a' },
      {
        kind: TokenKind.Opt,
        location: 6,
        child: {
          kind: TokenKind.Group,
          location: 1,
          end: 5,
          children: [
            {
              kind: TokenKind.Alt,
              location: 3,
              left: { kind: TokenKind.Lit, location: 2, value: 'b' },
              right: { kind: TokenKind.Lit, location: 4, value: 'c' }
            }
          ]
        }
      },
      {
        kind: TokenKind.Plus,
        location: 8,
        child: { kind: TokenKind.Lit, location: 7, value: 'd' }
      }
    ];
    const actual = parse('a(b|c)?d+');
    expect(actual).toStrictEqual(expected);
  });

  it('parses empty group ()', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Group,
        location: 0,
        end: 1,
        children: []
      }
    ];
    expect(parse('()')).toStrictEqual(expected);
  });

  it('parses empty group to object ()', () => {
    expect(compile('()')).toStrictEqual(Group([]));
  });
  it('parses quantifier on empty group ()*', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.Any,
        location: 2,
        child: {
          kind: TokenKind.Group,
          location: 0,
          end: 1,
          children: []
        }
      }
    ];
    expect(parse('()*')).toStrictEqual(expected);
  });

  it('parses quantifier on empty group to object ()*', () => {
    expect(compile('()*')).toStrictEqual(Any(Group([])));
  });

  it('parse quantifier on [abc]', () => {
    const expected: Token[] = [
      {
        kind: TokenKind.CharClass,
        location: 0,
        end: 4,
        children: [
          {
            kind: TokenKind.Lit,
            value: 'a',
            location: 1
          },
          {
            kind: TokenKind.Lit,
            value: 'b',
            location: 2
          },
          {
            kind: TokenKind.Lit,
            value: 'c',
            location: 3
          },
        ]
      }
    ];
    expect(parse('[abc]')).toStrictEqual(expected);
  })

  it('parse quantifier on [abc]', () => {
    expect(compile('[abc]')).toStrictEqual(CharClass([Lit('a'), Lit('b'), Lit('c')]));
  });


  it.each([
    ['a', 'a', true, Lit('a')],
    ['b', 'a', false, Lit('b')],
    ['a', 'ab', true, Lit('a')],
    ['b', 'ab', true, Lit('b')],
    ['ab', 'ab', true, Lit('a', Lit('b'))],
    ['ba', 'ab', false, Lit('b', Lit('a'))],
    ['ab', 'ba', false, Lit('a', Lit('b'))],
    ['^a', 'ab', true, Start(Lit('a'))],
    ['^b', 'ab', false, Start(Lit('b'))],
    ['a$', 'ab', false, Lit('a', End())],
    ['a$', 'ba', true, Lit('a', End())],
    ['a*', '', true, Any(Lit('a'))],
    ['a*', 'baac', true, Any(Lit('a'))],
    ['ab*c', 'ac', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'acc', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'abc', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'abbbc', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'abxc', false, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab+c', 'ac', false, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['ab+c', 'abc', true, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['ab+c', 'abbbc', true, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['ab+c', 'abxc', false, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['(ab)|(cd)', 'xaby', true, Alt(Group([Lit('a'), Lit('b')]), Group([Lit('c'), Lit('d')]))],
    ['(ab)|(cd)', 'acdc', true, Alt(Group([Lit('a'), Lit('b')]), Group([Lit('c'), Lit('d')]))],
    ['a(b|c)d', 'xabdy', true, Lit('a', Group([Alt(Lit('b'), Lit('c'))], Lit('d')))],
    ['a(b|c)d', 'xabady', false, Lit('a', Group([Alt(Lit('b'), Lit('c'))], Lit('d')))],
    ['ab?c', 'abc', true, Lit('a', Opt(Lit('b'), Lit('c')))],
    ['ab?c', 'ac', true, Lit('a', Opt(Lit('b'), Lit('c')))],
    ['ab?c', 'acc', true, Lit('a', Opt(Lit('b'), Lit('c')))],
    ['ab?c', 'a', false, Lit('a', Opt(Lit('b'), Lit('c')))],
    ["[abcd]", 'a', true, CharClass([Lit('a'), Lit('b'), Lit('c'), Lit('d')])],
    ["[abcd]", 'ab', true, CharClass([Lit('a'), Lit('b'), Lit('c'), Lit('d')])],
    ["[abcd]", 'xhy', false, CharClass([Lit('a'), Lit('b'), Lit('c'), Lit('d')])],
    ["[abcd]c", 'ac', true, CharClass([Lit('a'), Lit('b'), Lit('c'), Lit('d')], Lit('c'))],
    ["c[abcd]", 'c', false, Lit('c', CharClass([Lit('a'), Lit('b'), Lit('c'), Lit('d')]))],
  ])('parse, compile and matcher test ("%s" "%s" "%p")', (pattern, text, expected, expectedMatcher) => {
    const actualMatcher = compile(pattern);
    expect(actualMatcher).toStrictEqual(expectedMatcher);
    const actual = actualMatcher.match(text);
    expect(actual).toBe(expected);
  })

})
