import { Element } from "domhandler";
import { Expander, HandlerType } from "./expander";
import { NodeHandler } from "./node_handler";

export class IfHandler implements NodeHandler {
  // prevent the value of control variable change between `open` and
  // `close` call.
  private predicate: boolean;
  constructor() {
    this.predicate = false;
  }
  open(expander: Expander, node: Element): boolean {
    const doRest = expander.env.find(node.attribs[HandlerType.If]);
    this.predicate = doRest;
    if (doRest) {
      expander.showTag(node, false);
    }
    return doRest;
  }

  close(expander: Expander, node: Element): void {
    if (this.predicate) {
      expander.showTag(node, true);
    }
  }

}
