import assert from "assert";
import hope, { assertArraySame, assertMapEqual, assertSetEqual, assertThrows } from "./hope";

hope.test('test assertSetEqual happy path', () => {
  const setA = new Set([1, 2, 3, 4, 5]);
  const setB = new Set([5, 1, 2, 4, 3]);
  assertSetEqual(setA, setB, 'Set supposed to be equal');

  assertSetEqual(new Set([]), new Set([]), 'Empty Set');
});

hope.test('test assertMapEqual unhappy path', () => {
  assertThrows(assert.AssertionError, () => {
    const setA = new Set([1, 2, 3, 4, 5]);
    const setB = new Set([1, 2, 4, 3]);
    assertSetEqual(setA, setB, 'Set supposed to be equal');
  })
});

hope.test('test assertMapEqual happy path', () => {
  const mapA = {
    'a': 1,
    'b': 2,
  };
  const mapB = {
    'b': 2,
    'a': 1
  };
  assertMapEqual(mapA, mapB, 'Map supposed to be map');
});

hope.test('test assertMapEqual unhappy path', () => {
  const mapA = {
    'a': 1,
    'b': 3
  };
  const mapB = {
    'b': 2,
    'a': 1
  };
  assertThrows(assert.AssertionError, () => {
    assertMapEqual(mapA, mapB, 'Map supposed to be map');
  });
});


hope.test('test assertArraySame happy path', () => {
  const arr1 = [1, 2, 3, 2];
  const arr2 = [2, 1, 2, 3];
  assertArraySame(arr1, arr2, "Arrays should have same elements"); // Passe
});

hope.test('test assertArraySame unhappy path', () => {
  const arr1 = [1, 2, 3, 2];
  const arr2 = [2, 1, 2, 4];

  assertThrows(assert.AssertionError, () => {
    assertArraySame(arr1, arr2, "Arrays should have same elements"); // Passe
  });
});
