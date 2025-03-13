export abstract class RegexBase {
  // index to continue matching at or undefined indicating that matching failed
  abstract _match(text: string, start: number): number | undefined;

  match(text: string): boolean {
    // check if the pattern matches at the start of the string
    if (this._match(text, 0) !== undefined) {
      return true;
    }

    for (let i = 1; i < text.length; i += 1) {
      if (this._match(text, i) !== undefined) {
        return true;
      }
    }
    return false;
  }
}
