import graphlib from "@dagrejs/graphlib";
import { ConfigLoader } from "./config_loader";
import assert from "assert";

export abstract class GraphCreator extends ConfigLoader {
  protected graph: graphlib.Graph;
  buildGraph() {
    this.graph = new graphlib.Graph();
    this.config.forEach(rule => {
      this.graph.setNode(rule.target, {
        recipes: rule.recipes
      });
      rule.depends.forEach(dep => this.graph.setEdge(dep, rule.target));
    });
  }

  checkCycles() {
    const cycles = graphlib.alg.findCycles(this.graph);
    assert.strictEqual(cycles.length, 0, `Dependency graph contains cycles ${cycles}`);
  }
}
