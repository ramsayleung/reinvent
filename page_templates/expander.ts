import assert from "assert";
import { Node, Element, Text } from 'domhandler';

import { Env } from "./env";
import { Visitor } from "./visitor";
import { NodeHandler } from "./node_handler";
import { IfHandler } from "./z-if";
import { LoopHandler } from "./z-loop";
import { NumHandler } from "./z-num";
import { VarHandler } from "./z-var";
import { TraceHandler } from "./z-trace";
import { LiteralHandler } from "./z-literal";

export enum HandlerType {
  If = 'z-if',
  Loop = 'z-loop',
  Num = 'z-num',
  Var = 'z-var',
  Trace = 'z-trace',
  Literal = 'z-literal',
}

const HANDLERS: Record<HandlerType, NodeHandler> = {
  [HandlerType.If]: new IfHandler(),
  [HandlerType.Loop]: new LoopHandler(),
  [HandlerType.Num]: new NumHandler(),
  [HandlerType.Var]: new VarHandler(),
  [HandlerType.Trace]: new TraceHandler(),
  [HandlerType.Literal]: new LiteralHandler(),
}

export class Expander extends Visitor {
  public env: Env;
  private handlers: Record<HandlerType, NodeHandler>
  private result: string[]
  constructor(root: Node, vars: Object) {
    super(root);
    this.env = new Env(vars);
    this.handlers = HANDLERS;
    this.result = [];
  }

  open(node: Node): boolean {
    if (node.type === 'text') {
      const textNode = node as Text;
      this.output(textNode.data);
      return false;
    } else if (this.hasHandler(node as Element)) {
      return this.getHandler(node as Element).open(this, node);
    } else {
      this.showTag(node as Element, false);
      return true;
    }
  }

  close(node: Node): boolean {
    if (node.type === 'text') {
      return;
    }
    if (node.type === 'tag' && this.hasHandler(node as Element)) {
      this.getHandler(node as Element).close(this, node);
    } else {
      this.showTag(node as Element, true);
    }
  }

  hasHandler(node: Element): boolean {
    for (const name in node.attribs) {
      if (name in this.handlers) {
        return true;
      }
    }
    return false;
  }

  getHandler(node: Element) {
    const possible = Object.keys(node.attribs)
      .filter(name => name in this.handlers)
    assert(possible.length === 1, 'Should be exactly one handler');
    return this.handlers[possible[0]];
  }

  showTag(node: Element, closing: boolean) {
    if (closing) {
      this.output(`</${node.name}>`);
      return;
    }
    this.output(`<${node.name}`);
    if (node.name === 'body') {
      this.output(' style="font-size: 200%; margin-left: 0.5em"');
    } else {
      for (const name in node.attribs) {
        if (!name.startsWith('z-')) {
          this.output(` ${name}="${node.attribs[name]}"`);
        }
      }
    }
    this.output('>');
  }

  output(text: string) {
    this.result.push((text === undefined) ? 'UNDEF' : text);
  }

  getResult() {
    return this.result.join('');
  }
}
