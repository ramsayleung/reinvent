export interface Cell {
  getWidth(): number;
  getHeight(): number;
}

export class Block implements Cell {
  private width: number;
  private height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}

export class Row implements Cell {
  children: Cell[]
  constructor(...children: Cell[]) {
    this.children = children;
  }
  getWidth(): number {
    let result = 0;
    for (const child of this.children) {
      result += child.getWidth();
    }
    return result;
  }

  getHeight(): number {
    let result = 0;
    for (const child of this.children) {
      result = Math.max(result, child.getHeight());
    }
    return result;
  }
}

export class Col implements Cell {
  children: Cell[]
  constructor(...children: Cell[]) {
    this.children = children;
  }

  getWidth(): number {
    let result = 0;
    for (const child of this.children) {
      result = Math.max(result, child.getWidth());
    }
    return result;
  }

  getHeight(): number {
    let result = 0;
    for (const child of this.children) {
      result += child.getHeight();
    }
    return result;
  }
}
