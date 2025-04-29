import assert from "assert";
import { Node } from "./micro_dom";
export enum Order {
  Id = 0,
  Class = 1,
  Tag = 2
}

export abstract class CssRule {
  constructor(public order: Order, protected selector: string, protected styles: Record<string, any>) {

  }

  abstract match(node: Node): boolean;
}

export class IdRule extends CssRule {
  constructor(selector: string, styles: Record<string, any>) {
    assert(selector.startsWith('#') && (selector.length > 1), `ID rule ${selector} must start with # and have a selector`);
    super(Order.Id, selector.slice(1), styles);
  }

  match(node: Node): boolean {
    return node.attributes?.id == this.selector;
  }
}

export class ClassRule extends CssRule {
  constructor(selector: string, styles: Record<string, any>) {
    assert(selector.startsWith('.') && (selector.length > 1), `Class rule ${selector} must start with . and have a selector`);
    super(Order.Class, selector.slice(1), styles);
  }

  match(node: Node): boolean {
    return node.attributes?.class === this.selector;
  }
}
export class TagRule extends CssRule {
  constructor(selector: string, styles: Record<string, any>) {
    super(Order.Tag, selector, styles);
  }
  match(node: Node): boolean {
    return node.tag === this.selector;
  }

}

export class CssRuleSet {
  private rules: CssRule[];
  constructor(json: Record<string, any>) {
    this.rules = this.jsonToRules(json);
  }

  jsonToRules(json: Record<string, any>): CssRule[] {
    return Object.keys(json).map(selector => {
      assert(selector.length > 0, 'Require non-empty string as selector');
      if (selector.startsWith('#')) {
        return new IdRule(selector, json[selector]);
      }
      if (selector.startsWith('.')) {
        return new ClassRule(selector, json[selector]);
      }
      return new TagRule(selector, json[selector]);
    });
  }

  findRules(node: Node): CssRule[] {
    const matches = this.rules.filter(rule => rule.match(node));
    const sorted = matches.sort((left, right) => left.order - right.order);
    return sorted;
  }
}
