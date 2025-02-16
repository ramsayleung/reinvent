import assert from "assert";
import hope, { assertApproxEqual, assertRelativeApproxEqual, assertThrows } from "./hope";

hope.test('Default margin throws exception', () => {
  // throws exception
  assertThrows(assert.AssertionError, () => assertApproxEqual(1.0, 2.0, 'Value are too far apart'));

});

hope.test('Large margin not throws exception', () => {
  // does not throw
  assertApproxEqual(1.0, 2.0, 'Large margin of error', 10.0);
})

hope.test('Relative error throw exception', () => {
  assertThrows(assert.AssertionError, () => assertRelativeApproxEqual(1.0, 2.0, 'value are too far apart', 0.1));
})

hope.test('Default Relative error not throw exception: ', () => {
  assertRelativeApproxEqual(9.0, 10.0, 'Relative error not throws exception');
})
