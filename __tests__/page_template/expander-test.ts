import * as htmlparser2 from "htmlparser2";
import { Expander } from "../../page_templates/expander";
import { expandWithHeader } from "../../page_templates/template";
describe('Expander test', () => {
  const vars = {
    "firstVariable": "firstValue",
    "secondVariable": "secondValue",
    "variableName": "variableValue",
    "showThis": true,
    "doNotShowThis": false,
    "names": ["Johnson", "Vaughan", "Jackson"]
  };

  it.each([
    [`<html>
  <body>
    <p><span z-num="123"/></p>
  </body>
</html>`, `<html>
  <body>
    <p><span>123</span></p>
  </body>
</html>`], [
      `<html>
  <body>
    <p><span z-var="variableName"/></p>
  </body>
  </html>`,
      `<html>
  <body>
    <p><span>variableValue</span></p>
  </body>
  </html>`
    ], [
      `<html>
  <body>
    <p><span z-var="firstVariable" /></p>
    <p><span z-var="secondVariable" /></p>
  </body>
  </html>`,
      `<html>
  <body>
    <p><span>firstValue</span></p>
    <p><span>secondValue</span></p>
  </body>
  </html>`
    ], [
      `<html>
  <body>
    <p z-if="showThis">This should be shown.</p>
    <p z-if="doNotShowThis">This should <em>not</em> be shown.</p>
  </body>
</html>`,
      `<html>
  <body>
    <p>This should be shown.</p>
    
  </body>
</html>`
    ], [
      `<html>
  <body>
    <p>Expect three items</p>
    <ul z-loop="item:names">
      <li><span z-var="item"/></li>
    </ul>
  </body>
</html>`, `<html>
  <body>
    <p>Expect three items</p>
    <ul>
      <li><span>Johnson</span></li>
    
      <li><span>Vaughan</span></li>
    
      <li><span>Jackson</span></li>
    </ul>
  </body>
</html>`],
    [`<html>
  <body>
    <div>
      <div z-literal="true">
      <span z-var="variableName"></span>
      </div>
    </div>
  </body>
  </html>`,
      `<html>
  <body>
    <div>
      
      <span z-var="variableName"></span>
      
    </div>
  </body>
  </html>`]
  ])('expand page template test', (inputHtml, expectedOutput) => {
    const doc = htmlparser2.parseDocument(inputHtml).children[0];
    const expander = new Expander(doc, vars);
    expander.walk();
    expect(expander.getResult()).toStrictEqual(expectedOutput)
  })

  it('expand z-trace', () => {
    const inputHtml = `<html>
  <body>
    <p><span z-trace="firstVariable" /></p>
    <p><span z-trace="secondVariable" /></p>
  </body>
    </html>`;
    console.error = jest.fn();
    const doc = htmlparser2.parseDocument(inputHtml).children[0];
    const expander = new Expander(doc, vars);
    expander.walk();
    expect(console.error).toHaveBeenCalledWith('firstVariable=firstValue');
  })

  it.each([[`<html>
  <body>
    <p><span z-var="variableName"/></p>
    <div z-include="../__tests__/page_template/simple.html"></div>
  </body>
  </html>`, `<html>
  <body>
    <p><span>variableValue</span></p>
    <div>
  <p>First</p>
  <p>Second</p>
</div>
  </body>
  </html>`], [`<html>
  <body>
    <p><span z-var="variableName"/></p>
    <div z-include="../__tests__/page_template/include-var.html"></div>
  </body>
  </html>`, `<html>
  <body>
    <p><span>variableValue</span></p>
    <div>
  <p>First</p>
  <p><span>firstValue</span></p>
</div>
  </body>
  </html>`]])('expand z-include %s %s', (inputHtml, expectedHtml) => {
    const doc = htmlparser2.parseDocument(inputHtml).children[0];
    const expander = new Expander(doc, vars);
    expander.walk();
    expect(expander.getResult()).toStrictEqual(expectedHtml);
  })

  it.each([[`<html>
  <body>
    <p>Expect three items</p>
    <div z-snippet="prefix"><strong>Important:</strong></div>
    <ul z-loop="item:names">
  <li><span z-var="prefix"></span><span z-var="item"></span></li>
    </ul>
  </body>
</html>`, `<html>
  <body>
    <p>Expect three items</p>
    
    <ul>
  <li><span><strong>Important:</strong></span><span>Johnson</span></li>
    
  <li><span><strong>Important:</strong></span><span>Vaughan</span></li>
    
  <li><span><strong>Important:</strong></span><span>Jackson</span></li>
    </ul>
  </body>
</html>`]])('expand HTML snippets', (inputHtml, expectedHtml) => {
    const doc = htmlparser2.parseDocument(inputHtml).children[0];
    const expander = new Expander(doc, vars);
    expander.walk();
    expect(expander.getResult()).toStrictEqual(expectedHtml);
  })

  it.each([[`---
name: "Dorothy Johnson Vaughan"
---
<html>
  <body>
    <p><span z-var="name"/></p>
  </body>
</html>`, `<html>
  <body>
    <p><span>Dorothy Johnson Vaughan</span></p>
  </body>
</html>`]])('expect yaml header', (inputHtml, expectedHtml) => {
    const result = expandWithHeader(inputHtml);
    expect(result).toStrictEqual(expectedHtml);
  })

  it.each([[`<div z-index="i" z-limit="5">
  Iteration: <span z-var="i"/><br/>
  </div>`, `<div>
  Iteration: <span>0</span>
  Iteration: <span>1</span>
  Iteration: <span>2</span>
  Iteration: <span>3</span>
  Iteration: <span>4</span></div>`]])('expect iteration', (inputHtml, expectedHtml) => {
    const result = expandWithHeader(inputHtml);
    expect(result).toStrictEqual(expectedHtml);
  })
})
