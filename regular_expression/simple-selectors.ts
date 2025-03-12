import assert from "assert";
export interface DomNode {
  type: string;
  name?: string;
  attribs?: {
    id?: string;
    class?: string;
    [key: string]: string | undefined;
  };
  children?: DomNode[];
  data?: string;
  parent?: DomNode;
}

export const select = (root: DomNode, selector: string): DomNode | null => {
  const selectors = selector.split(' ').filter(s => s.length > 0);
  return firstMatch(root, selectors);
}

// Find the first matched Node.
const firstMatch = (node: DomNode, selectors: string[]): DomNode => {
  assert(selectors.length > 0, 'Require selector(s)');

  // Not a tag.
  if (node.type !== 'tag') {
    return null;
  }

  // this node matches.
  if (matchHere(node, selectors[0])) {
    // This is the last selector, so matching worked.
    if (selectors.length === 1) {
      return node;
    }

    // Try to match renaming selectors
    return firstChildMatch(node, selectors.slice(1));

  }
  // this node doesn't match, so try further down.
  return firstChildMatch(node, selectors);
}

// Finds the first child of a node to match a set of selectors.
const firstChildMatch = (node: DomNode, selectors: string[]) => {
  assert(node.type === 'tag', `should only try on match first child of tags, not ${node.type}`);

  // First working match.
  for (const child of node.children) {
    const match = firstMatch(child, selectors);
    if (match) {
      return match;
    }
  }

  // Nothing worked
  return null;
}

const matchHere = (node: DomNode, selector: string): boolean => {
  let name = null;
  let id = null;
  let clazz = null;
  if (selector.includes('#')) {
    [name, id] = selector.split('#');
  } else if (selector.includes('.')) {
    [name, clazz] = selector.split('.');
  } else {
    name = selector;
  }

  return (node.name == name) && ((id === null) || (node.attribs.id === id)) && ((clazz === null) || (node.attribs.class === clazz));
}
