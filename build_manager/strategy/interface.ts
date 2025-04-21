import { Graph } from "@dagrejs/graphlib";
export interface BuildRule {
  target: string;
  depends: string[];
  recipes: string[];
  timestamp?: number;
}

export type RuleData = Pick<BuildRule, 'recipes' | 'depends'>;

export interface IGraphProcessor {
  process(graph: Graph): void;
}

export interface IConfigLoader {
  load(): BuildRule[];
}

export interface IGraphBuilder {
  buildGraph(config: BuildRule[]): [Graph, Map<string, RuleData>];
  expandRules(graph: Graph, rules: Map<string, RuleData>): void;
}

export interface IRunner {
  execute(graph: Graph): void;
}
