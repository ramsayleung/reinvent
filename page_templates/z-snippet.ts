import { Element } from "domhandler";
import { Expander, HandlerType } from "./expander";
import { NodeHandler } from "./node_handler";

export class SnippetHandler implements NodeHandler {
  open(expander: Expander, node: Element): boolean {
    const snippet = node.attribs[HandlerType.Snippet];
    // create a temporary result to capture the result of snippet
    const originalOutput = expander['result'];
    expander['result'] = []
    node.children.forEach(child => expander.walk(child));
    const snippetResult = expander.getResult();
    expander['result'] = originalOutput;
    expander.env.push({ [snippet]: snippetResult });
    return false;
  }

  close(expander: Expander, node: Element): void {
  }

}
