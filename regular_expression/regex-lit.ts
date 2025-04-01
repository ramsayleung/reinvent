import { INVALID_INDEX, RegexBase } from "./regex-base";

class RegexLit extends RegexBase {
  private chars: string;
  // the rest of the matcher
  private rest: RegexBase
  constructor(chars: string, rest: RegexBase | null) {
    super()
    this.chars = chars;
    this.rest = rest;
  }

  // Checks whether all of the pattern matches the target text
  // starting at the current location. If so, it checks whether the
  // rest of the overall pattern matches what’s left.
  _match(text: string, start: number): number {
    const nextIndex = start + this.chars.length;
    if (nextIndex > text.length) {
      return INVALID_INDEX;
    }

    if (text.slice(start, nextIndex) !== this.chars) {
      return INVALID_INDEX;
    }

    if (this.rest === null) {
      return nextIndex;
    }

    return this.rest._match(text, nextIndex);
  }
}

export default (chars: string, rest: RegexBase = null) => new RegexLit(chars, rest);
