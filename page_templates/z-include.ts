import { Element } from "domhandler";
import fs from 'fs'
import { NodeHandler } from "./node_handler";
import { Expander, HandlerType } from "./expander";
import * as htmlparser2 from "htmlparser2";
import path from "path";
export class IncludeHandler implements NodeHandler {
  open(expander: Expander, node: Element): boolean {
    const htmlPath = node.attribs[HandlerType.Include];
    const content = fs.readFileSync(path.resolve(__dirname, htmlPath), 'utf-8');
    const doc = htmlparser2.parseDocument(content).children[0];
    expander.walk(doc);
    return false;
  }

  close(expander: Expander, node: Element): void {
  }

}
