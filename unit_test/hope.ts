import assert from "assert";
import caller from 'caller';

type SyncCallbackType = () => void;
type AsyncCallbackType = () => Promise<void>;
type CallbackType = SyncCallbackType | AsyncCallbackType;

class Hope {
  private todo: [string, CallbackType, Array<string>][] = [];
  private passes: string[] = [];
  private fails: string[] = [];
  private errors: string[] = [];
  private setupFn: CallbackType | null = null;
  private teardownFn: CallbackType | null = null;
  constructor() {
    this.todo = [];
    this.passes = [];
    this.fails = [];
    this.errors = [];
  }

  setup(setupFn: CallbackType) {
    this.setupFn = setupFn;
  }

  teardown(teardownFn: CallbackType) {
    this.teardownFn = teardownFn;
  }

  test(comment: string, callback: () => void, tags: Array<string> = []) {
    this.todo.push([`${caller()}::${comment}`, callback, tags]);
  }

  private async runTest(comment: string, test: CallbackType, tags: string[]) {
    try {
      if (this.setupFn) {
        if (this.isAsync(this.setupFn)) {
          await this.setupFn();
        } else {
          this.setupFn();
        }
      }

      const now = process.hrtime.bigint()
      if (this.isAsync(test)) {
        await test();
      } else {
        test();
      }

      const elapsedInMacro = (process.hrtime.bigint() - now) / (BigInt(1000));
      this.passes.push(comment + `, execution time: ${elapsedInMacro}us`);

      if (this.teardownFn) {
        if (this.isAsync(this.teardownFn)) {
          await this.teardownFn();
        } else {
          this.teardownFn();
        }
      }
    } catch (e) {
      if (e instanceof assert.AssertionError) {
        this.fails.push(comment);
      } else {
        this.errors.push(comment);
      }
    }
  }

  async run(tag: string = '') {
    const tests = this.todo
      .filter(([comment, test, tags]) => {
        if (tag.length === 0) { return true; }
        return tags.indexOf(tag) > - 1;
      });


    for (const [comment, test, tags] of tests) {
      await this.runTest(comment, test, tags);
    }
  }

  private isAsync(fn: CallbackType): fn is AsyncCallbackType {
    return fn.constructor.name === 'AsyncFunction';
  }

  terse() {
    return this.cases()
      .map(([title, results]) => `${title}: ${results.length}`)
      .join(' ');
  }

  verbose() {
    let report = '';
    let prefix = '';
    for (const [title, results] of this.cases()) {
      report += `${prefix}${title}:`;
      prefix = '\n';
      for (const r of results) {
        report += `${prefix} ${r}`
      }
    }
    return report;
  }

  cases() {
    return [
      ['passes', this.passes],
      ['fails', this.fails],
      ['errors', this.errors]
    ]
  }
}

/**
 * assert 抛出指定的异常
 */ 
export function assertThrows<T extends Error>(expectedType: new (...args: any[]) => T, func: () => void) {
  try {

    // expected to throw exception
    func();
    // unreachable 
    assert(false, `Expected function to throw ${expectedType.name} but it did not throw`);
  } catch (error) {
    assert(error instanceof expectedType, `Expected function to throw ${expectedType.name} but it threw ${error instanceof Error ? error.constructor.name : typeof error}`);
  }
}

/**
 * assert 两个元素相等
 */
export function assertEqual<T>(actual: T, expected: T, message: string) {
  assert(actual === expected, message);
}

export function assertApproxEqual(actual: number, expected: number, message: string, margin: number = 0.01) {
  assert(Math.abs(actual - expected) <= margin, message);
}

export function assertRelativeApproxEqual(actual: number, expected: number, message: string, relativeError: number = 0.1) {
  assert(Math.abs(actual - expected) / expected <= relativeError, message);
}

/**
 * assert 两个 Set 相同
 */
export function assertSetEqual<T>(actual: Set<T>, expected: Set<T>, message: string) {
  assert(actual.size == expected.size, message);
  for (const element of actual) {
    assert(expected.has(element), message);
  }
}

/**
 * assert 两个 Map 相同
 */
export function assertMapEqual<K extends string | number | symbol, V>(actual: Record<K, V>, expected: Record<K, V>, message: string) {
  const actualKeys = Object.keys(actual) as K[];
  const expectedKeys = Object.keys(expected) as K[];

  assert(actualKeys.length === expectedKeys.length, message);
  for (const actualKey of actualKeys) {
    assert(expected[actualKey] && actual[actualKey] == expected[actualKey], message);
  }
}

/**
 * assert两个列举的值相等，如元素相等，但是顺序不同也被视为相同
 */
export function assertArraySame<T>(actual: Array<T>, expected: Array<T>, message: string) {
  assert(actual.length === expected.length, message);
  assertSetEqual(new Set(actual), new Set(expected), message);
}

export default new Hope()
