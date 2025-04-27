import { PlacedBlock, PlacedCol, PlacedRow } from "./placed";
export interface Wrappable {
  wrap(): PlacedBlock | PlacedCol | PlacedRow;
}

export class WrappedBlock extends PlacedBlock implements Wrappable {
  wrap(): WrappedBlock {
    return this;
  }
}

type WrappedComponent = WrappedBlock | WrappedRow | WrappedCol;
export class WrappedCol extends PlacedCol implements Wrappable {
  declare public children: WrappedComponent[];

  constructor(...children: Array<WrappedBlock | WrappedRow | WrappedCol>) {
    super(...children);
  }
  wrap(): PlacedCol {
    const children = this.children.map(child => child.wrap());
    return new PlacedCol(...children);
  }

}

export class WrappedRow extends PlacedRow implements Wrappable {
  declare public children: WrappedComponent[];
  declare public width: number;
  constructor(width: number, ...children: Array<WrappedBlock | WrappedCol | WrappedRow>) {
    super(...children);
    this.width = width;
  }

  getWidth(): number {
    return this.width;
  }

  wrap(): PlacedRow {
    const children = this.children.map(child => child.wrap())
    const rows = [];
    let currentRow = [];
    let currentX = 0;

    children.forEach(child => {
      const childWidth = child.getWidth();
      if ((currentX + childWidth) <= this.getWidth()) {
        currentRow.push(child);
        currentX += childWidth;
      } else {
        rows.push(currentRow);
        currentRow = [child];
        currentX = childWidth;
      }
    });
    rows.push(currentRow);

    const newRows = rows.map(row => new PlacedRow(...row));
    const newCol = new PlacedCol(...newRows);
    return new PlacedRow(newCol);
  }

}
