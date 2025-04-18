import { INVALID_INDEX, RegexBase } from "./regex-base";

class RegexAlt extends RegexBase {
  rest: RegexBase;
  private left: RegexBase;
  private right: RegexBase;

  constructor(left: RegexBase, right: RegexBase, rest: RegexBase | null) {
    super()
    this.rest = rest;
    this.left = left;
    this.right = right;
  }

  _match(text: string, start: number): number {
    for (const pattern of [this.left, this.right]) {
      const afterPattern = pattern._match(text, start);
      if (afterPattern !== INVALID_INDEX) {
        if (this.rest === null) {
          return afterPattern;
        }

        const afterRest = this.rest._match(text, afterPattern);
        if (afterRest !== INVALID_INDEX) {
          return afterRest;
        }
      }
    }

    return INVALID_INDEX;
  }
}

const create = (left: RegexBase, right: RegexBase, rest = null) => {
  return new RegexAlt(left, right, rest);
}

export default create;
