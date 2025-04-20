import { Graph } from "@dagrejs/graphlib";
export interface BuildRule {
  target: string;
  depends: string[];
  recipes: string[];
  timestamp?: number;
}

export interface IGraphProcessor {
  process(graph: Graph): void;
}

export interface IConfigLoader {
  load(): BuildRule[];
}

export interface IGraphBuilder {
  buildGraph(config: BuildRule[]): [Graph, Map<string, any>];
  expandRules(graph: Graph, rules: Map<string, any>): void;
}

export interface IRunner {
  execute(graph: Graph): void;
}
