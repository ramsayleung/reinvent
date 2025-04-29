import { ClassRule, CssRuleSet, IdRule, TagRule } from "../../layout_engine/micro_css";
import { parseHTML } from "../../layout_engine/parse"

describe('Test style', () => {
  it('styles a tree of nodes with multiples rules', async () => {
    const html = [
      '<col id="name">',
      '<row class="kind">first\nsecond</row>',
      '<row>three\nfourth</row>',
      '</col>'
    ]
    const dom = parseHTML(html.join(''));
    const rules = new CssRuleSet({
      '.kind': { height: 3 },
      '#name': { height: 5 },
      row: { width: 10 }
    });
    dom.findRule(rules);
    expect(dom.rules).toStrictEqual([new IdRule('#name', { height: 5 })]);
    expect(dom.children[0].rules).toStrictEqual([
      new ClassRule('.kind', { height: 3 }),
      new TagRule('row', { width: 10 })
    ]);
    expect(dom.children[1].rules).toStrictEqual([
      new TagRule('row', { width: 10 })
    ]);
  })
})
