import { RegexBase } from "./regex-base";

class RegexEnd extends RegexBase {
  private rest: RegexBase;
  constructor(rest: RegexBase | null) {
    super()
    this.rest = rest;
  }

  _match(text: string, start: number): number {
    if (start !== text.length) {
      return undefined;
    }

    if (this.rest === null) {
      return text.length;
    }

    return this.rest._match(text, start);
  }
}

export default (rest = null) => new RegexEnd(rest);
