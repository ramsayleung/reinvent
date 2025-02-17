import hope, { assertEqual } from "./hope";

let x = 0;

const createFixtures = () => {
  x = 1;
}

hope.setup(createFixtures);
hope.test('Validate x should be 1', () => {
  assertEqual(x, 1, 'X should be 1');
});

const cleanUp = () => {
  x = 0;
}

hope.teardown(cleanUp);
