import { WrappedBlock, WrappedRow, WrappedCol } from "../../layout_engine/wrapped";

describe('test wrapped', () => {
  it('wrap a row of two blocks that do not fit on one row', async () => {
    const fixture = new WrappedRow(
      3,
      new WrappedBlock(2, 1),
      new WrappedBlock(2, 1)
    );
    const wrapped = fixture.wrap();
    wrapped.place(0, 0);
    const result = wrapped.report();
    expect(result).toStrictEqual(
      ['row', 0, 0, 2, 2,
        ['col', 0, 0, 2, 2,
          ['row', 0, 0, 2, 1,
            ['block', 0, 0, 2, 1]],
          ['row', 0, 1, 2, 2,
            ['block', 0, 1, 2, 2]
          ]
        ]
      ])
  })
})
