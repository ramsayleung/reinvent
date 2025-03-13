import { RegexBase } from "./regex-base";

class RegexStart extends RegexBase {
  // the rest of the matcher
  private rest: RegexBase
  constructor(rest: RegexBase | null) {
    super()
    this.rest = rest;
  }

  _match(text: string, start: number): number | undefined {
    if (start !== 0) {
      return undefined;
    }

    if (this.rest === null) {
      return 0;
    }

    return this.rest._match(text, start);
  }
}

export default (rest: RegexBase = null) => new RegexStart(rest);
