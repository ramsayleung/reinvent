import { PlacedBlock, PlacedRow } from "../../layout_engine/placed"

describe('places blocks', () => {
  it('places a single unit block', async () => {
    const fixture = new PlacedBlock(1, 1);
    fixture.place(0, 0);
    expect(fixture.report()).toStrictEqual(
      ['block', 0, 0, 1, 1]
    )
  })

  it('places a larget block', async () => {
    const fixture = new PlacedBlock(3, 4);
    fixture.place(0, 0);
    expect(fixture.report()).toStrictEqual(
      ['block', 0, 0, 3, 4]
    );
  })

  it('places a row of two blocks', async () => {
    const fixture = new PlacedRow(
      new PlacedBlock(1, 1),
      new PlacedBlock(2, 4)
    )
    fixture.place(0, 0);
    expect(fixture.report()).toStrictEqual([
      'row', 0, 0, 3, 4,
      ['block', 0, 3, 1, 4],
      ['block', 1, 0, 3, 4]
    ])
  })
})
