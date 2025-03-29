import { RegexBase } from "./regex-base";

// Match zero or one
class RegexOpt extends RegexBase {
  constructor(child: RegexBase, rest: RegexBase | null) {
    super();
    this.child = child;
    this.rest = rest;
  }

  private child: RegexBase;
  private rest: RegexBase;

  _match(text: string, start: number): number | undefined {
    const matchChild = this.child._match(text, start);

    // case 1: child matches, process with rest at this position
    if (matchChild !== undefined) {
      if (this.rest !== null) {
        const matchWithRest = this.rest._match(text, matchChild);
        if (matchWithRest !== undefined) {
          return matchWithRest;
        }
        // rest doesn't match, fallback to case 2
      } else {
        return matchChild;
      }
    }

    // case 2: child fail -> (skip it) return original position
    if (this.rest !== null) {
      return this.rest._match(text, start);
    }

    return start;
  }
}

const create = (child: RegexBase, rest: RegexBase = null) => {
  return new RegexOpt(child, rest);
}
export default create;
