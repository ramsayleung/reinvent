import { INVALID_INDEX, RegexBase } from "./regex-base";

class RegexEnd extends RegexBase {
  rest: RegexBase;
  constructor(rest: RegexBase | null) {
    super()
    this.rest = rest;
  }

  _match(text: string, start: number): number {
    if (start !== text.length) {
      return INVALID_INDEX;
    }

    if (this.rest === null) {
      return text.length;
    }

    return this.rest._match(text, start);
  }
}

export default (rest = null) => new RegexEnd(rest);
