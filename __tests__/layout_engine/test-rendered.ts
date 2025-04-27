import { RenderedCol as Col, RenderedRow as Row, RenderedBlock as Block, render } from "../../layout_engine/render"

describe('test render', () => {
  it('renders a grid of rows of columns', async () => {
    const fixture = new Col(
      new Row(
        new Block(1, 2),
        new Block(3, 4)
      ),
      new Row(
        new Block(1, 2),
        new Col(
          new Block(3, 4),
          new Block(2, 3)
        )
      )
    )
    expect(render(fixture)).toStrictEqual(
      [
        'bddd',
        'bddd',
        'cddd',
        'cddd',
        'ehhh',
        'ehhh',
        'ehhh',
        'ehhh',
        'eiig',
        'fiig',
        'fiig'
      ].join('\n')
    )
  })
})
