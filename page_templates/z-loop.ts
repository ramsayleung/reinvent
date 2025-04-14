import { Element } from "domhandler"
import { Expander, HandlerType } from "./expander";
import { NodeHandler } from "./node_handler";

export class LoopHandler implements NodeHandler {
  open(expander: Expander, node: Element): boolean {
    const [indexName, targetName] = node.attribs[HandlerType.Loop].split(':');
    delete node.attribs[HandlerType.Loop];
    expander.showTag(node, false);
    const target = expander.env.find(targetName);
    for (const index of target) {
      expander.env.push({ [indexName]: index });
      node.children.forEach(child => expander.walk(child));
      expander.env.pop();
    }
    return false;
  }

  close(expander: Expander, node: Element): void {
    expander.showTag(node, true);
  }
}
