import { INVALID_INDEX, RegexBase } from "./regex-base";

// Lazy implementation
// Match Zero or more character

class RegexAnyLazy extends RegexBase {
  private child: RegexBase;
  private rest: RegexBase;
  constructor(child: RegexBase, rest: RegexBase | null) {
    super();
    this.child = child;
    this.rest = rest;
  }

  _match(text: string, start: number): number{
    // case 1: try zero match  
    if (this.rest !== null) {
      const matchRest = this.rest._match(text, start);
      if (matchRest !== INVALID_INDEX) {
        return matchRest;
      }
    } else {
      // if no rest, fine to return start
      return start;
    }

    // match with rest failed, which mean it couldn't match with zero occurrences, 
    // trying matching one occurence and then recursively match the rest
    const nextPos = this.child._match(text, start);
    if (nextPos !== INVALID_INDEX && nextPos !== start) {
      const resultAfterOne = this._match(text, nextPos);
      if (resultAfterOne !== INVALID_INDEX) {
        return resultAfterOne;
      }
    }

    return INVALID_INDEX;
  }
}

const createLazy = (child: RegexBase, rest: RegexBase = null) => {
  return new RegexAnyLazy(child, rest);
}
export default createLazy;
