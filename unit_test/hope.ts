import assert from "assert";
import caller from 'caller';
import microtime from 'microtime';

type CallbackType = () => void;
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

  run(tag: string = '') {
    this.todo
      .filter(([comment, test, tags]) => {
        if (tag.length === 0) { return true; }
        return tags.indexOf(tag) > - 1;
      })
      .forEach(([comment, test, tags]) => {
        try {
          if (this.setupFn) {
            this.setupFn();
          }

          const now = microtime.now();
          test();
          const elapsedInMacro = microtime.now() - now;
          this.passes.push(comment + `, execution time: ${elapsedInMacro}us`);

          if (this.teardownFn) {
            this.teardownFn();
          }
        } catch (e) {
          if (e instanceof assert.AssertionError) {
            this.fails.push(comment);
          } else {
            this.errors.push(comment);
          }
        }
      })
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

export function assertEqual<T>(actual: T, expected: T, message: string) {
  assert(actual === expected, message);
}

export function assertApproxEqual(actual: number, expected: number, message: string, margin: number = 0.01) {
  assert(Math.abs(actual - expected) <= margin, message);
}

export function assertRelativeApproxEqual(actual: number, expected: number, message: string, relativeError: number = 0.1) {
  assert(Math.abs(actual - expected) / expected <= relativeError, message);
}

export default new Hope()
