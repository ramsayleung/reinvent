import assert from 'assert';

const HopeTests: [string, () => void][] = [];
let HopePass = 0;
let HopeFail = 0;
let HopeError = 0;

// Record a single test for running later.
const hopeThat = (message: string, callback: () => void) => {
  HopeTests.push([message, callback]);
}

const main = () => {
  HopeTests.forEach(([message, test]) => {
    try {
      test();
      HopePass += 1;
    } catch (e) {
      if (e instanceof assert.AssertionError) {
        HopeFail += 1;
      } else {
        HopeError += 1;
      }
    }
  });

  console.log(`pass ${HopePass}`);
  console.log(`fail ${HopeFail}`);
  console.log(`error ${HopeError}`);
}

// Something to test(doesn't handle zero properly)

const sign = (value: number) => {
  if (value < 0) {
    return -1;
  } else {
    return 1;
  }
}

// These two should pass
hopeThat('Sign of negative is -1', () => assert(sign(-3) === -1));
hopeThat('Sign of positive is 1', () => assert(sign(10) === 1));

// This one should fail.
hopeThat('Sign of zero is 0', () => assert(sign(0) === 0));

// This one is an error.
hopeThat('Sign mispelled is erorr', () => assert(sign(sgn(1) === 1)));

// Call the main driver
main()
