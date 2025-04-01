export const INVALID_INDEX = -1;
export abstract class RegexBase {
  // index to continue matching at or -1 indicating that matching failed
  abstract _match(text: string, start: number): number;
  abstract rest: RegexBase;

  match(text: string): boolean {
    // check if the pattern matches at the start of the string
    if (this._match(text, 0) !== INVALID_INDEX) {
      return true;
    }

    for (let i = 1; i < text.length; i += 1) {
      if (this._match(text, i) !== INVALID_INDEX) {
        return true;
      }
    }
    return false;
  }
}
