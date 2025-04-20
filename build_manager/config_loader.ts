import { SkeletonBuilder } from "./skeleton_builder";
import fs from 'fs';
import { parse } from 'yaml';

export interface Rule {
  target: string,
  depends: string[],
  recipes: string[]
}

export abstract class ConfigLoader extends SkeletonBuilder {
  protected config: Rule[];

  loadConfig() {
    const fileContents = fs.readFileSync(this.configFilePath, 'utf8');
    this.config = parse(fileContents) as Rule[];
  }
}
