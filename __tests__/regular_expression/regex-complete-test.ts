import Alt from '../../regular_expression/regex-alt';
import Any from '../../regular_expression/regex-any';
import End from '../../regular_expression/regex-end';
import Lit from '../../regular_expression/regex-lit';
import Start from '../../regular_expression/regex-start';
import Plus from '../../regular_expression/regex-plus';
import Opt from '../../regular_expression/regex-opt';
import AnyLazy from '../../regular_expression/regex-any-lazy';
import Set from '../../regular_expression/regex-set';
describe('Regex testsuite', () => {
  it.each([
    ['a', 'a', true, Lit('a')],
    ['b', 'a', false, Lit('b')],
    ['a', 'ab', true, Lit('a')],
    ['b', 'ab', true, Lit('b')],
    ['ab', 'ab', true, Lit('a', Lit('b'))],
    ['ba', 'ab', false, Lit('b', Lit('a'))],
    ['ab', 'ba', false, Lit('ab')],
    ['^a', 'ab', true, Start(Lit('a'))],
    ['^b', 'ab', false, Lit('a', End())],
    ['a$', 'ab', false, Lit('a', End())],
    ['a$', 'ba', true, Lit('a', End())],
    ['a*', '', true, Any(Lit('a'))],
    ['a*', 'baac', true, Any(Lit('a'))],
    ['ab*c', 'ac', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'acc', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'abc', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'abbbc', true, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'abxc', false, Lit('a', Any(Lit('b'), Lit('c')))],
    ['ab*c', 'ac', true, Lit('a', AnyLazy(Lit('b'), Lit('c')))],
    ['ab*c', 'acc', true, Lit('a', AnyLazy(Lit('b'), Lit('c')))],
    ['ab*c', 'abc', true, Lit('a', AnyLazy(Lit('b'), Lit('c')))],
    ['ab*c', 'abbbc', true, Lit('a', AnyLazy(Lit('b'), Lit('c')))],
    ['ab*c', 'abxc', false, Lit('a', AnyLazy(Lit('b'), Lit('c')))],
    ['ab*', 'ab', true, Lit('a', AnyLazy(Lit('b')))],
    ['ab+c', 'ac', false, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['ab+c', 'abc', true, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['ab+c', 'abbbc', true, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['ab+c', 'abxc', false, Lit('a', Plus(Lit('b'), Lit('c')))],
    ['ab|cd', 'xaby', true, Alt(Lit('ab'), Lit('cd'))],
    ['ab|cd', 'acdc', true, Alt(Lit('ab'), Lit('cd'))],
    ['a(b|c)d', 'xabdy', true, Lit('a', Alt(Lit('b'), Lit('c'), Lit('d')))],
    ['a(b|c)d', 'xabady', false, Lit('a', Alt(Lit('b'), Lit('c'), Lit('d')))],
    ['ab?c', 'abc', true, Lit('a', Opt(Lit('b'), Lit('c')))],
    ['ab?c', 'ac', true, Lit('a', Opt(Lit('b'), Lit('c')))],
    ['ab?c', 'acc', true, Lit('a', Opt(Lit('b'), Lit('c')))],
    ['ab?c', 'a', false, Lit('a', Opt(Lit('b'), Lit('c')))],
    ["('abcd')", 'a', true, Set('abcd')],
    ["('abcd')", 'ab', true, Set('abcd')],
    ["('abcd')", 'xhy', false, Set('abcd')],
    ["('abcd')c", 'ac', true, Set('abcd', Lit('c'))],
    ["c('abcd')", 'c', false, Lit('c', Set('abcd'))],
  ])('Regex base test ("%s" "%s" "%p")', (_pattern, text, expected, matcher) => {
    const actual = matcher.match(text);
    expect(actual).toBe(expected);
  })
});
