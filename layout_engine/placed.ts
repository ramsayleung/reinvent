import { Block, Col, Placeable, Row } from "./easy_mode";

export class PlacedBlock extends Block {
  x0: number | null;
  y0: number | null;
  constructor(width: number, height: number) {
    super(width, height)
    this.x0 = null;
    this.y0 = null;
  }

  place(x0, y0) {
    this.x0 = x0;
    this.y0 = y0;
  }
  report() {
    return [
      'block', this.x0, this.y0,
      this.x0 + this.getWidth(),
      this.y0 + this.getHeight()
    ]
  }
}

export class PlacedCol extends Col implements Placeable {
  x0: number | null;
  y0: number | null;
  constructor(...children: Placeable[]) {
    super(...children);
    this.x0 = null;
    this.y0 = null;
  }

  place(x0, y0) {
    this.x0 = x0;
    this.y0 = y0;
    let yCurrent = this.y0;
    for (const child of this.children as Placeable[]) {
      child.place(x0, yCurrent);
      yCurrent += child.getHeight();
    }
  }

  report() {
    return [
      'col', this.x0, this.y0,
      this.x0 + this.getWidth(),
      this.y0 + this.getHeight(),
      ...this.children.map((child: Placeable) => child.report())
    ]
  }
}

export class PlacedRow extends Row {
  x0: number | null;
  y0: number | null;
  constructor(...children: Placeable[]) {
    super(...children);
    this.x0 = null;
    this.y0 = null;
  }

  place(x0, y0) {
    this.x0 = x0;
    this.y0 = y0;
    const y1 = this.y0 + this.getHeight();
    let xCurrent = x0;
    for (const child of this.children as Placeable[]) {
      const childY = y1 - child.getHeight();
      child.place(xCurrent, childY);
      xCurrent += child.getWidth()
    }
  }

  report() {
    return [
      'row', this.x0, this.y0,
      this.x0 + this.getWidth(),
      this.y0 + this.getHeight(),
      ...this.children.map((child: Placeable) => child.report())
    ]
  }
}
