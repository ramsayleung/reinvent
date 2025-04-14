import * as htmlparser2 from "htmlparser2";
import { Expander } from './expander';
import { parse as parseYml } from "yaml";

export const expand = (html: string, vars: Record<string, any>): string => {
  const doc = htmlparser2.parseDocument(html).children[0];
  const expander = new Expander(doc, vars);
  expander.walk();
  return expander.getResult();
}

export const expandWithHeader = (html: string): string => {
  const yamlHeaderIndicator = "---";
  const parts = html.split(yamlHeaderIndicator);
  if (parts.length >= 3 && parts[0].trim() === '') {
    // The YAML content is the second part (index 1)
    const yamlContent = parts[1];
    const vars = parseYml(yamlContent) || {};
    const htmlContent = parts[2].trim();

    return expand(htmlContent, vars);
  }

  return expand(html, {});
}
