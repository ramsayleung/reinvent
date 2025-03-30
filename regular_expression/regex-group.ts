import { RegexBase } from "./regex-base";

// Matches any character from a set
class RegexGroup extends RegexBase {
  private children: RegexBase[];
  private rest: RegexBase;

  constructor(children: RegexBase[], rest: RegexBase | null) {
    super();
    this.children = children;
    this.rest = rest;
  }

  _match(text: string, start: number): number | undefined {
    for (const pattern of this.children) {
      const afterPattern = pattern._match(text, start);
      if (afterPattern !== undefined) {
        if (this.rest !== null) {
          return this.rest._match(text, afterPattern);
        }

        return afterPattern;
      }
    }
    return undefined;
  }
}

export default (children: RegexBase[], rest: RegexBase = null) => new RegexGroup(children, rest);
