import { INVALID_INDEX, RegexBase } from "./regex-base";

// Expressions like [xyz] are interpreted to mean “match any one of the characters x, y, or z”.
class RegexCharClass extends RegexBase {
  private children: RegexBase[];
  rest: RegexBase;

  constructor(children: RegexBase[], rest: RegexBase | null) {
    super();
    this.children = children;
    this.rest = rest;
  }

  _match(text: string, start: number): number {
    for (const pattern of this.children) {
      const afterPattern = pattern._match(text, start);
      if (afterPattern !== INVALID_INDEX) {
        if (this.rest !== null) {
          return this.rest._match(text, afterPattern);
        }

        return afterPattern;
      }
    }
    return INVALID_INDEX;
  }
}

export default (children: RegexBase[], rest: RegexBase = null) => new RegexCharClass(children, rest);
