import { RegexBase } from "./regex-base";

class RegexAlt extends RegexBase {
  private rest: RegexBase;
  private left: RegexBase;
  private right: RegexBase;

  constructor(left: RegexBase, right: RegexBase, rest: RegexBase | null) {
    super()
    this.rest = rest;
    this.left = left;
    this.right = right;
  }

  _match(text: string, start: number): number | undefined {
    for (const pattern of [this.left, this.right]) {
      const afterPattern = pattern._match(text, start);
      if (afterPattern !== undefined) {
        if (this.rest === null) {
          return afterPattern;
        }

        const afterRest = this.rest._match(text, afterPattern);
        if (afterRest !== undefined) {
          return afterRest;
        }
      }
    }
    return undefined;
  }
}

const create = (left: RegexBase, right: RegexBase, rest = null) => {
  return new RegexAlt(left, right, rest);
}

export default create;
