import { Node, NodeWithChildren } from "domhandler"
export abstract class Visitor {
  private root: Node;
  constructor(root: Node) {
    this.root = root;
  }

  walk(node: Node = null) {
    if (node === null) {
      node = this.root
    }

    if (this.open(node)) {
      if ('children' in node) {
        (node as NodeWithChildren).children.forEach(child => {
          this.walk(child)
        });
      }
    }
    this.close(node);
  }

  // handler to be called when first arrive at a node
  abstract open(node: Node): boolean;

  // handler to be called when finished with a node
  abstract close(node: Node): void;
}
