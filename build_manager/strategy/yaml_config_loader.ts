import fs from 'fs';
import { parse } from 'yaml';
import { BuildRule, IConfigLoader } from "./interface";

export class YamlConfigLoader implements IConfigLoader {
  constructor(private path: string) {}
  load(): BuildRule[] {
    const fileContents = fs.readFileSync(this.path, 'utf8');
    return parse(fileContents) as BuildRule[];
  }
}
