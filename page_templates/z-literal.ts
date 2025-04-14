import { Element } from "domhandler";
import { Expander } from "./expander";
import { NodeHandler } from "./node_handler";
import render from "dom-serializer";
export class LiteralHandler implements NodeHandler {
  open(expander: Expander, node: Element): boolean {
    expander.output(render(node.children));
    return false;
  }

  close(expander: Expander, node: Element): void {
  }
}
