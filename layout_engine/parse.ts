import assert from 'assert';
import { DomBlock, DomCol, DomRow, Node } from './micro_dom';

// parsing HTML text into a DOM tree
export const parseHTML = (text: string): Node => {
  const chunks = chunkify(text.trim());
  assert(isElement(chunks[0]), 'Must have enclosing outer node');
  const [node, remainer] = makeNode(chunks);
  assert(remainer.length === 0, 'Cannot have dangling content');
  return node;
}

// Splits HTML text into an array of alternating text content and tag chunks.
const chunkify = (text: string): string[] => {
  const raw: string[] = [];
  let currentPos = 0;
  while (currentPos < text.length) {
    // Find the next tag opening
    const tagStart = text.indexOf('<', currentPos);

    // if no more tags, add remaining text and exit
    if (tagStart === -1) {
      if (currentPos < text.length) {
        raw.push(text.slice(currentPos));
      }
      break;
    }

    // Add text before the tag if there is any
    if (tagStart > currentPos) {
      raw.push(text.slice(currentPos, tagStart));
    }

    // find the end of tag
    let tagEnd = text.indexOf('>', tagStart);
    if (tagEnd === -1) {
      throw new Error('Malformed HTML: unclosed tag');
    }

    // Add the complete tag
    raw.push(text.slice(tagStart, tagEnd + 1));
    currentPos = tagEnd + 1;
  }

  return raw.filter(chunk => chunk.length > 0);
}

// Determines if a chunk is an HTML element (tag).
const isElement = (chunk: string): boolean => {
  return chunk && (chunk[0] === '<')
}

// Recursively builds a node and its children from an array of chunks.
const makeNode = (chunks: string[]): [Node, string[]] => {
  assert(chunks.length > 0, 'Cannot make nodes without chunks');
  if (!isElement(chunks[0])) {
    return [new DomBlock(chunks[0]), chunks.slice(1)];
  }

  const node = makeOpening(chunks[0]);
  const closing = `</${node.tag}>`
  let reminder = chunks.slice(1);
  let child = null;

  while (reminder && (reminder[0] !== closing)) {
    [child, reminder] = makeNode(reminder);
    node.children.push(child);
  }

  assert(reminder && reminder[0] === closing, `Node with tag ${node.tag} not closed`);
  return [node, reminder.slice(1)];
}

// Creates a node from an opening tag chunk.
const makeOpening = (chunk: string): Node => {
  const tagInfo = parseTagInfo(chunk);
  const tag = tagInfo.tagName;
  const attributes = parseAttributes(tagInfo.attributesText);
  let Cls = null;
  if (tag === 'col') {
    Cls = DomCol;
  } else if (tag === 'row') {
    Cls = DomRow;
  }
  assert(Cls !== null, `Unrecognized tag name ${tag}`);
  return new Cls(attributes);
}

// parses attribute text into a key-value object.
export const parseAttributes = (attributesText: string): Record<string, string> => {
  const attributes: Record<string, string> = {};

  if (!attributesText) {
    return attributes;
  }

  let currentPos = 0;
  while (currentPos < attributesText.length) {
    // Skip whitespace
    while (currentPos < attributesText.length && attributesText[currentPos].trim() === '') {
      currentPos++;
    }

    // reach the end
    if (currentPos >= attributesText.length) {
      break;
    }

    // find the attribute name
    let nameStart = currentPos;
    while (currentPos < attributesText.length && attributesText[currentPos] !== '=' && attributesText[currentPos].trim() !== '') {
      currentPos++;
    }
    const name = attributesText.slice(nameStart, currentPos).trim();
    // Skip to the opening quote
    while (currentPos < attributesText.length && attributesText[currentPos] !== '"') {
      currentPos++;
    }

    // skip past the opening quote
    currentPos++;

    // find the closing quote
    const valueStart = currentPos;
    while (currentPos < attributesText.length && attributesText[currentPos] !== '"') {
      currentPos++;
    }
    const value = attributesText.slice(valueStart, currentPos);
    attributes[name] = value;
    currentPos++;
  }
  return attributes;
}

// parses a tag string to extract the tag name and attributes section
export const parseTagInfo = (tagText: string): { tagName: string, attributesText: string } => {
  // remove < and > characters
  const content = tagText.slice(1, -1).trim();

  // Find the space after the tag name
  const firstSpace = content.indexOf(' ');

  // no space, it's a tag without attributes
  if (firstSpace === -1) {
    return { tagName: content, attributesText: '' };
  }

  const tagName = content.slice(0, firstSpace);
  const attributesText = content.slice(firstSpace + 1).trim();
  return { tagName, attributesText };
}
