import { RegexBase } from "./regex-base";

// Matches any character from a set
class RegexSet extends RegexBase {
  private chars: string;
  private rest: RegexBase;

  constructor(chars: string, rest: RegexBase | null) {
    super();
    this.chars = chars;
    this.rest = rest;
  }

  _match(text: string, start: number): number | undefined {
    let nextIndex = undefined;
    if (this.chars.indexOf(text[start]) > -1) {
      nextIndex = start + 1;
    }

    if (this.rest === null) {
      return nextIndex;
    }

    return this.rest._match(text, nextIndex);
  }
}

export default (chars: string, rest: RegexBase = null) => new RegexSet(chars, rest);
