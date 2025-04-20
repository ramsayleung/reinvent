import graphlib from "@dagrejs/graphlib";
import { BuildRule, IGraphBuilder } from "./interface";

export class BasicGraphBuilder implements IGraphBuilder {
  expandRules(graph: graphlib.Graph, rules: Map<string, any>): void {
    // not need to expand
  }

  buildGraph(config: BuildRule[]): [graphlib.Graph, Map<string, any>] {
    const graph = new graphlib.Graph();
    config.forEach(rule => {
      graph.setNode(rule.target, {
        recipes: rule.recipes
      });
      rule.depends.forEach(dep => graph.setEdge(dep, rule.target));
    });
    const emptyRule = new Map();
    return [graph, emptyRule];
  }

}
