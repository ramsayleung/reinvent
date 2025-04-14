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
  <body style="font-size: 200%; margin-left: 0.5em">
    <p><span>123</span></p>
  </body>
</html>`], [
      `<html>
  <body>
    <p><span z-var="variableName"/></p>
  </body>
  </html>`,
      `<html>
  <body style="font-size: 200%; margin-left: 0.5em">
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
  <body style="font-size: 200%; margin-left: 0.5em">
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
  <body style="font-size: 200%; margin-left: 0.5em">
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
  <body style="font-size: 200%; margin-left: 0.5em">
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
  <body style="font-size: 200%; margin-left: 0.5em">
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

})
