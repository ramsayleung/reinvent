import { Element } from "domhandler";
import { Expander, HandlerType } from "./expander";
import { NodeHandler } from "./node_handler";

export class TraceHandler implements NodeHandler {
  open(expander: Expander, node: Element): boolean {
    const key = node.attribs[HandlerType.Trace];
    const value = expander.env.find(key);
    console.error(`${key}=${value}`);
    return false;
  }

  close(expander: Expander, node: Element): void {
  }

}
