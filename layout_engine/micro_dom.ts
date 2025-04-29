import { Placeable } from "./easy_mode";
import { CssRule, CssRuleSet } from "./micro_css";
import { WrappedBlock, WrappedCol, WrappedRow } from "./wrapped";

export interface Selectable {
  findRule(css: CssRuleSet): void
}

export interface Node extends Placeable, Selectable {
  x0: number;
  y0: number;
  rules?: CssRule[];
  children?: Node[];
  attributes?: {
    id?: string;
    class?: string;
    [key: string]: string | undefined;
  };
  tag?: string;
}

type SelectableComponent = DomBlock | DomCol | DomRow;
export class DomBlock extends WrappedBlock implements Selectable {
  private lines: string;
  rules: CssRule[] | null;
  tag: string;
  constructor(lines: string) {
    super(Math.max(...lines.split('\n').map(line => line.length)),
      lines.length)
    this.lines = lines;
    this.tag = 'text';
    this.rules = null;
  }
  findRule(css: CssRuleSet): void {
    this.rules = css.findRules(this);
  }

}

export class DomCol extends WrappedCol implements Selectable {
  declare children: SelectableComponent[];
  attributes: Record<string, any>;
  tag: string;
  rules: CssRule[];

  constructor(attributes: Record<string, any>, ...children: SelectableComponent[]) {
    super(...children);
    this.attributes = attributes;
    this.tag = 'col';
    this.rules = null;
  }

  findRule(css: CssRuleSet): void {
    this.rules = css.findRules(this);
    this.children.forEach(child => child.findRule(css));
  }

}

export class DomRow extends WrappedRow implements Selectable {
  declare children: SelectableComponent[];
  attributes: Record<string, any>;
  tag: string;
  rules: CssRule[];

  constructor(attributes: Record<string, any>, ...children: SelectableComponent[]) {
    super(0, ...children);
    this.attributes = attributes;
    this.tag = 'row';
    this.rules = null;
  }

  findRule(css: CssRuleSet): void {
    this.rules = css.findRules(this);
    this.children.forEach(child => child.findRule(css));
  }
}
