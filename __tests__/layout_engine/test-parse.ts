import { parseAttributes } from "../../layout_engine/parse";

describe('Test parse', () => {
  it('Test parseAttributes succeeds', async () => {
    const attributesText = `id="icp" class="fleft"`;
    const attributes = parseAttributes(attributesText);
    expect(Object.entries(attributes).length).toBe(2);
    expect('id' in attributes).toBeTruthy()
    expect(attributes['id']).toBe("icp");
    expect('class' in attributes).toBeTruthy()
    expect(attributes['class']).toBe("fleft");
  })

  it('Test parse broken attributes with closing quote', async () => {
    const attributesText = `id="icp`;
    const attributes = parseAttributes(attributesText);
    expect(Object.entries(attributes).length).toBe(1);
    expect('id' in attributes).toBeTruthy()
    expect(attributes['id']).toBe("icp");
  })

  it('Test parse empty attributes', async () => {
    const attributesText = `id`;
    const attributes = parseAttributes(attributesText);
    expect(Object.entries(attributes).length).toBe(1);
    expect('id' in attributes).toBeTruthy()
    expect(attributes['id']).toBe("");
  })
})
