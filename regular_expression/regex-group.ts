import { INVALID_INDEX, RegexBase } from "./regex-base";

// Matches the exact sequence "xyz" (e.g., "a(bc)d" only matches "abcd").
class RegexGroup extends RegexBase {
  private children: RegexBase[];
  rest: RegexBase;

  constructor(children: RegexBase[], rest: RegexBase | null) {
    super();
    this.children = children;
    this.rest = rest;
  }

  _match(text: string, start: number): number {
    let afterPattern = start;
    for (const pattern of this.children) {
      afterPattern = pattern._match(text, afterPattern);
      if (afterPattern === INVALID_INDEX) {
        return INVALID_INDEX;
      }
    }

    if (this.rest !== null) {
      return this.rest._match(text, afterPattern);
    }

    return afterPattern;
  }
}

export default (children: RegexBase[], rest: RegexBase = null) => new RegexGroup(children, rest);
