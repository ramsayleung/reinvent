import * as htmlparser2 from "htmlparser2";
import { DomNode, select, parseSelector } from "../../html_selector/simple-selectors";

const getText = (node: DomNode): string => {
  if (!node) {
    return 'MISSING NODE';
  }

  if (!('children' in node)) {
    return 'MISSING CHILDREN';
  }

  if (node.children.length !== 1) {
    return 'WRONG NUMBER OF CHILDREN';
  }

  if (node.children[0].type !== 'text') {
    return 'NOT TEXT';
  }
  return node.children[0].data;
}

describe('HTML selector testsuite', () => {
  const HTML = `<main>
  <p>text of first p</p>
  <p id="id-01">text of p#id-01</p>
  <p id="id-02">text of p#id-02</p>
  <p class="class-03">text of p.class-03</p>
  <div>
    <p>text of div / p</p>
    <p id="id-04">text of div / p#id-04</p>
    <p class="class-05">text of div / p.class-05</p>
    <p class="class-06">should not be found</p>
  </div>
  <div id="id-07">
    <p>text of div#id-07 / p</p>
    <p class="class-06">text of div#id-07 / p.class-06</p>
  </div>
  <div id="id-08">
    <div align="center">text attributes</div>
  </div>
  <div id="id-09">
    <span class="class-10">
       <a>child selector</a>
    </span>
  </div>
</main>`

  it.each([
    ['p', 'text of first p'],
    ['p#id-01', 'text of p#id-01'],
    ['p#id-02', 'text of p#id-02'],
    ['p.class-03', 'text of p.class-03'],
    ['div p', 'text of div / p'],
    ['div p#id-04', 'text of div / p#id-04'],
    ['div p.class-05', 'text of div / p.class-05'],
    ['div#id-07 p', 'text of div#id-07 / p'],
    ['div#id-07 p.class-06', 'text of div#id-07 / p.class-06'],
    [`div[align=center]`, 'text attributes'],
    ['div#id-09>span.class-10 a', 'child selector']
  ])('test select %s', async (selector, expected) => {
    const doc = htmlparser2.parseDOM(HTML)[0];
    const nodes: DomNode[] = select(doc, selector);
    const actual = getText(nodes[0]);
    expect(actual).toBe(expected);
  })

  it.each([
    ['p', 10],
    ['main', 1],
    ['p#id-01', 1],
    ['p.class-06', 2],
  ])('multiple select %s', async (selector, expectedCount) => {
    const doc = htmlparser2.parseDOM(HTML)[0];
    const nodes: DomNode[] = select(doc, selector);
    expect(nodes.length).toBe(expectedCount);
  })
})

describe('parseSelector', () => {
  test('parses tag selector', () => {
    const selectors = parseSelector('div');
    expect(selectors).toHaveLength(1);
    expect(selectors[0].match({ name: 'div', type: 'tag' })).toBe(true);
    expect(selectors[0].match({ name: 'span', type: 'tag' })).toBe(false);
  });

  test('parses id selector', () => {
    const selectors = parseSelector('div#myId');
    expect(selectors).toHaveLength(2);
    expect(selectors[0].match({ name: 'div', type: 'tag' })).toBe(true);
    expect(selectors[1].match({ type: "tag", attribs: { id: 'myId' } })).toBe(true);
  });

  test('parses class selector', () => {
    const selectors = parseSelector('div.myClass');
    expect(selectors).toHaveLength(2);
    expect(selectors[0].match({ name: 'div', type: 'tag' })).toBe(true);
    expect(selectors[1].match({ type: "tag", attribs: { class: 'myClass' } })).toBe(true);
  });

  test('parses attribute selector', () => {
    const selectors = parseSelector('div[data-test="value"]');
    expect(selectors).toHaveLength(2);
    expect(selectors[0].match({ name: 'div', type: 'tag' })).toBe(true);
    expect(selectors[1].match({ type: "tag", attribs: { 'data-test': 'value' } })).toBe(true);
  });

  test('parses attribute selector without double quote', () => {
    const selectors = parseSelector('div[align=center]');
    expect(selectors).toHaveLength(2);
    expect(selectors[0].match({ name: 'div', type: 'tag' })).toBe(true);
    expect(selectors[1].match({ type: "tag", attribs: { 'align': 'center' } })).toBe(true);
  });

  test('handles missing tag name before id', () => {
    const selectors = parseSelector('#myId');
    expect(selectors).toHaveLength(1);
    expect(selectors[0].match({ type: "tag", attribs: { id: 'myId' } })).toBe(true);
  });

  test('handles missing tag name before class', () => {
    const selectors = parseSelector('.myClass');
    expect(selectors).toHaveLength(1);
    expect(selectors[0].match({ type: "tag", attribs: { class: 'myClass' } })).toBe(true);
  });
});
