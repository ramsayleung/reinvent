import { Element } from "domhandler";
import { Expander, HandlerType } from "./expander";
import { NodeHandler } from "./node_handler";

export class NumHandler implements NodeHandler {
  open(expander: Expander, node: Element): boolean {
    expander.showTag(node, false);
    expander.output(node.attribs[HandlerType.Num])
    return false;
  }

  close(expander: Expander, node: Element): void {
    expander.showTag(node, true);
  }
}
