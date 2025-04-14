import { Expander } from "./expander";
import { Element } from "domhandler";

export interface NodeHandler {
  open(expander: Expander, node: Element): boolean;
  close(expander: Expander, node: Element): void;
}
