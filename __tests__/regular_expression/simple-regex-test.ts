import { match } from "../../regular_expression/simple-regex";

describe('SimpleRegex testsuite', () => {
  it.each([
    ['a', 'a', true],
    ['b', 'a', false],
    ['a', 'ab', true],
    ['b', 'ab', true],
    ['ab', 'ba', false],
    ['^a', 'ab', true],
    ['^b', 'ab', false],
    ['a$', 'ab', false],
    ['a$', 'ba', true],
    ['a*', '', true],
    ['a*', 'baac', true],
    ['ab*c', 'ac', true],
    ['ab*c', 'abc', true],
    ['ab*c', 'abbc', true],
    ['ab*c', 'abxc', false],
  ])('regex match tests', (regexp, text, expected) => {
    const actual = match(regexp, text);
    expect(actual).toBe(expected);
  })

  it('match test for `a*ab`', () => {
    const text = 'aab';
    const actual = match(`a*ab`, text);
    expect(actual).toBe(true);
  })
})
