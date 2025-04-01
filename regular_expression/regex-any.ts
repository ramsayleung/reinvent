import { INVALID_INDEX, RegexBase } from "./regex-base";

// Greedy implementation
// Match zero or more character 
class RegexAny extends RegexBase {
  private child: RegexBase;
  private rest: RegexBase;

  constructor(child: RegexBase, rest: RegexBase | null) {
    super();
    this.child = child;
    this.rest = rest;
  }

  _match(text: string, start: number): number {
    const matchPositions = [start]; // start position is always
    // included(even for zero match)
    let currentPos = start;
    while (true) {
      const nextPos = this.child._match(text, currentPos);
      if (nextPos === INVALID_INDEX || nextPos === currentPos) {
        // failed to match or it doesn't advance the position
        break;
      }
      matchPositions.push(nextPos);
      currentPos = nextPos;
    }

    // Try all possible ending positions for the repeating patern,
    // from most to least
    for (let i = matchPositions.length - 1; i >= 0; i--) {
      const pos = matchPositions[i];

      if (this.rest !== null) {
        const result = this.rest._match(text, pos);
        if (result !== INVALID_INDEX) {
          return result;
        }
      } else {
        return pos;
      }
    }

    return INVALID_INDEX;
  }
}

const create = (child: RegexBase, rest: RegexBase = null) => {
  return new RegexAny(child, rest);
}
export default create;
