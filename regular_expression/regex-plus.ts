import { INVALID_INDEX, RegexBase } from "./regex-base";

// Match one or more character 
class RegexPlus extends RegexBase {
  private child: RegexBase;
  rest: RegexBase;

  constructor(child: RegexBase, rest: RegexBase | null) {
    super();
    this.child = child;
    this.rest = rest;
  }

  _match(text: string, start: number): number {
    const maxPossible = text.length - start;
    // Match at least one
    for (let num = maxPossible; num >= 1; num -= 1) {
      const afterMany = this._matchMany(text, start, num);
      if (afterMany !== INVALID_INDEX) {
        return afterMany;
      }
    }
    return INVALID_INDEX;
  }

  _matchMany(text: string, start: number, num: number) {
    for (let i = 0; i < num; i += 1) {
      start = this.child._match(text, start);
      if (start === INVALID_INDEX) {
        return INVALID_INDEX;
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
