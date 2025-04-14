import { Element } from "domhandler";
import { Expander, HandlerType } from "./expander";
import { NodeHandler } from "./node_handler";

export class IterationHandler implements NodeHandler {
  open(expander: Expander, node: Element): boolean {
    expander.showTag(node, false);
    const zIndex = 'z-index';
    if (zIndex in node.attribs && HandlerType.Limit in node.attribs) {
      const indexName = node.attribs[zIndex];
      const limit = Number(node.attribs[HandlerType.Limit]);
      delete node.attribs[HandlerType.Limit];
      delete node.attribs[zIndex];
      if (!isNaN(limit)) {
        for (let i = 0; i < limit; i++) {
          expander.env.push({ [indexName]: i });
          node.children.forEach(child => expander.walk(child));
          expander.env.pop();
        }
      }
    }
    return false;
  }

  close(expander: Expander, node: Element): void {
    expander.showTag(node, true);
  }

}
