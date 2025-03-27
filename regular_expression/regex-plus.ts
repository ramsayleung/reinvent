import { RegexBase } from "./regex-base";

// Match one or more character 
class RegexPlus extends RegexBase {
  private child: RegexBase;
  private rest: RegexBase;

  constructor(child: RegexBase, rest: RegexBase | null) {
    super();
    this.child = child;
    this.rest = rest;
  }

  _match(text: string, start: number): number | null {
    const maxPossible = text.length - start;
    // Match at least one
    for (let num = maxPossible; num >= 1; num -= 1) {
      const afterMany = this._matchMany(text, start, num);
      if (afterMany !== undefined) {
        return afterMany;
      }
    }
    return undefined;
  }

  _matchMany(text: string, start: number, num: number) {
    for (let i = 0; i < num; i += 1) {
      start = this.child._match(text, start);
      if (start === undefined) {
        return undefined;
      }
    }

    if (this.rest !== null) {
      return this.rest._match(text, start);
    }
    return start;
  }
}

const create = (child: RegexBase, rest: RegexBase = null) => {
  return new RegexPlus(child, rest);
}
export default create;
