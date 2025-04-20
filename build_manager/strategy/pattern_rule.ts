import { Graph } from "@dagrejs/graphlib";
import { BuildRule, IGraphBuilder, IGraphProcessor } from "./interface";
import graphlib from '@dagrejs/graphlib';
import assert from 'assert';

interface Node {
  recipes: string[]
  timestamp: number;
}

// Handle % pattern rules
export class PatternRuleExpander implements IGraphBuilder {
  buildGraph(config: BuildRule[]): [Graph, Map<string, any>] {
    const graph = new graphlib.Graph();
    const rules = new Map();

    config.forEach(rule => {
      if (rule.target.includes('%')) {
        const data = {
          recipes: rule.recipes,
          depends: rule.depends
        };
        rules.set(rule.target, data);
      } else {
        const timestamp = rule.timestamp || null;
        graph.setNode(rule.target, {
          recipes: rule.recipes,
          timestamp: timestamp
        } as Node);

        rule.depends.forEach(dep => {
          assert(!dep.includes('%'), 'Cannot have "%" in a non-pattern rule');
          graph.setEdge(dep, rule.target);
        });
      }
    });

    return [graph, rules];
  }

  expandRules(graph: Graph, rules: Map<string, any>): void {
    graph.nodes().forEach(target => {
      // Skip if target has dependencies
      const predecessors = graph.predecessors(target);
      if (predecessors && predecessors.length > 0) {
        return;
      }

      // Skip if target has recipes
      const data = graph.node(target) as Node;
      if (data.recipes.length > 0) {
        return;
      }

      const rule = this.findRule(target, rules);
      if (!rule) {
        return;
      }
      this.expandRule(target, rule, graph);
    })
  }

  findRule(target: string, rules: Map<string, any>): any {
    const pattern = `%.${target.split('.')[1]}`;
    return rules.has(pattern) ? rules.get(pattern) : null;
  }

  expandRule(target: string, rule: BuildRule, graph: Graph): void {
    const basename = target.split('.')[0];
    rule.depends.map(dep => dep.replace('%', basename))
      .forEach(dep => graph.setEdge(dep, target));

    const recipes = rule.recipes.map(act => act.replace('%', basename));
    const timestamp = (graph.node(target) as Node).timestamp;
    graph.setNode(target, {
      recipes: recipes,
      timestamp: timestamp
    } as Node);
  }
}
