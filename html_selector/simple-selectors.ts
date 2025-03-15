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

export const select = (root: DomNode, selector: string): (DomNode | null)[] => {
  let selectors = selector.split(' ').filter(s => s.length > 0);
  selectors = selectors.map(selector => selector.split('>')).flat();
  const selectorGroup: Selector[][] = selectors.map(selector => parseSelector(selector));

  return findNodeBySelectors(root, selectorGroup);
}

// Find the first matched Node.
const findNodeBySelectors = (node: DomNode, selectors: Selector[][]): DomNode[] => {
  assert(selectors.length > 0, 'Require selector(s)');

  // Not a tag.
  if (node.type !== 'tag') {
    return null;
  }

  // this node matches.
  if (isMatch(node, selectors[0])) {
    // This is the last selector, so matching worked.
    if (selectors.length === 1) {
      return [node];
    }

    // Try to match renaming selectors
    return childMatch(node, selectors.slice(1));

  }
  // this node doesn't match, so try further down.
  return childMatch(node, selectors);
}

// Finds the first child of a node to match a set of selectors.
const childMatch = (node: DomNode, selectors: Selector[][]): DomNode[] => {
  assert(node.type === 'tag', `should only try on match first child of tags, not ${node.type}`);

  let result: DomNode[] = [];
  // First working match.
  for (const child of node.children) {
    const match = findNodeBySelectors(child, selectors);
    if (match) {
      result = result.concat(match);
    }
  }

  // Nothing worked
  return result;
}

const isMatch = (node: DomNode, selectors: Selector[]): boolean => {
  return selectors.every(selector => selector.match(node));
}

export const parseSelector = (selector: string): Selector[] => {
  const selectors: Selector[] = [];
  let name = null;
  let id = null;
  let clazz = null;
  let attribute = null;
  let key = null;
  let value = null;
  if (selector.includes('#')) {
    [name, id] = selector.split('#');
  } else if (selector.includes('.')) {
    [name, clazz] = selector.split('.');
  } else if (selector.includes('[')) {
    [name, attribute] = selector.split('[');
    const [keypair, _] = attribute.split(']');
    [key, value] = keypair.split('=');
    value = value.replaceAll('"', '');
  } else {
    name = selector;
  }

  if (name && name.length > 0) {
    selectors.push(findByTagName(name));
  }
  if (id && id.length > 0) {
    selectors.push(findById(id));
  }
  if (clazz && clazz.length > 0) {
    selectors.push(findByClass(clazz));
  }
  if (key && key.length > 0 && value && value.length > 0) {
    selectors.push(findByAttributes(key, value));
  }

  return selectors;
}

interface Selector {
  match(node: DomNode): boolean;
}

const findByTagName = (tag: string): Selector => ({
  match: (node: DomNode): boolean => {
    return node.name.toLowerCase() === tag.toLowerCase()
  }
});

const findById = (id: string): Selector => ({
  match: (node: DomNode): boolean => {
    return node.attribs.id === id;
  }
})

const findByClass = (clazz: string): Selector => ({
  match: (node: DomNode): boolean => {
    return node.attribs.class === clazz;
  }
});

const findByAttributes = (key: string, value: string): Selector => ({
  match: (node: DomNode): boolean => {
    return node.attribs[key] === value;
  }
})
