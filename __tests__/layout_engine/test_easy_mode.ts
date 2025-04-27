import { Block, Col, Row } from "../../layout_engine/easy_mode"

describe('lays out in easy mode', () => {
  it('lays out a single unit block', async () => {
    const fixture = new Block(1, 1);
    expect(fixture.getWidth()).toStrictEqual(1);
    expect(fixture.getHeight()).toStrictEqual(1);
  })

  it('lays out a large block', async () => {
    const fixture = new Block(3, 4);
    expect(fixture.getWidth()).toStrictEqual(3);
    expect(fixture.getHeight()).toStrictEqual(4);
  })

  it('lays out a row of two blocks', async () => {
    const fixture = new Row(
      new Block(1, 1),
      new Block(2, 4)
    );

    expect(fixture.getWidth()).toStrictEqual(3);
    expect(fixture.getHeight()).toStrictEqual(4);
  })

  it('lays out a column of two blocks', async () => {
    const fixture = new Col(
      new Block(1, 1),
      new Block(2, 4)
    );
    expect(fixture.getHeight()).toStrictEqual(5);
    expect(fixture.getWidth()).toStrictEqual(2);
  })

  it('lays out a grid of rows of columns', async () => {
    // 14, 22
    const fixture = new Col(
      // 4, 4
      new Row(
        new Block(1, 2),
        new Block(3, 4)
      ),
      // 14, 18
      new Row(
        new Block(5, 6),
        // 9, 18
        new Col(
          new Block(7, 8),
          new Block(9, 10)
        )
      )
    );
    expect(fixture.getWidth()).toStrictEqual(14);
    expect(fixture.getHeight()).toStrictEqual(22);
  })
})
