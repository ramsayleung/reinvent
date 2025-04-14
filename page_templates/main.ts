import fs from 'fs'
import * as htmlparser2 from "htmlparser2";
import { Expander } from './expander';

const main = () => {
  const vars = readJSON(process.argv[2]);
  const doc = readHtml(process.argv[3]);
  const expander = new Expander(doc, vars);
  expander.walk();
  console.log(expander.getResult());
}

const readJSON = (filename: string) => {
  const text = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(text);
}

const readHtml = (filename: string) => {
  const text = fs.readFileSync(filename, 'utf-8');
  return htmlparser2.parseDocument(text).children[0];
}

main()
