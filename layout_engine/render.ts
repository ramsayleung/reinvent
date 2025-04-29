import { Placeable } from "./easy_mode";
import { PlacedBlock, PlacedCol, PlacedRow } from "./placed";

export const render = (root: Renderable) => {
  root.place(0, 0);
  const width = root.getWidth();
  const height = root.getHeight();
  const screen = makeScreen(width, height);
  draw(screen, root);
  return screen.map(row => row.join('')).join('\n');
}

export interface Renderable extends Placeable {
  x0: number;
  y0: number;
  children?: Renderable[];
  render(screen: string[][], fill: string): void;
}

const makeScreen = (width: number, height: number): string[][] => {
  const screen = [];
  for (let i = 0; i < height; i += 1) {
    screen.push(new Array(width).fill(' '));
  }
  return screen;
}

const draw = (screen: string[][], node: Renderable, fill: string = null): string => {
  fill = nextFill(fill);
  node.render(screen, fill);
  node.children?.forEach(child => {
    fill = draw(screen, child, fill)
  });
  return fill;
}

const nextFill = (fill: string): string => {
  return (fill === null) ? 'a' : String.fromCharCode(fill.charCodeAt(0) + 1)
}

const drawBlock = (screen: string[][], node: Renderable, fill: string) => {
  for (let ix = 0; ix < node.getWidth(); ix += 1) {
    for (let iy = 0; iy < node.getHeight(); iy += 1) {
      screen[node.y0 + iy][node.x0 + ix] = fill;
    }
  }
}
export class RenderedBlock extends PlacedBlock implements Renderable {
  render(screen: string[][], fill: string) {
    drawBlock(screen, this, fill);
  }
}

export class RenderedCol extends PlacedCol implements Renderable {
  // We need to override the children property to make it compatible with Node
  declare children: Renderable[];

  constructor(...children: Renderable[]) {
    super(...children);
  }
  render(screen: string[][], fill: string): void {
    drawBlock(screen, this, fill);
  }
}

export class RenderedRow extends PlacedRow implements Renderable {
  // We need to override the children property to make it compatible with Node
  declare children: Renderable[];

  constructor(...children: Renderable[]) {
    super(...children);
  }
  render(screen: string[][], fill: string): void {
    drawBlock(screen, this, fill);
  }
}
