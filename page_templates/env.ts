export class Env {
  private stack: Record<string, any>[];
  constructor(initial: Record<string, any>) {
    this.stack = [];
    this.push(Object.assign({}, initial));
  }

  push(frame: Record<string, any>) {
    this.stack.push(frame);
  }

  pop() {
    this.stack.pop();
  }

  find(name: string) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (name in this.stack[i]) {
        return this.stack[i][name];
      }
    }

    return undefined;
  }

  toString() {
    return JSON.stringify(this.stack);
  }
}
