import assert from "assert";
import hope from "./hope";

hope.test('delayed test', async () => {
  setTimeout(() => {
    assert(1 + 1 > 1, '1 plus 1 is greater than 1');
  }, 4000);
});
