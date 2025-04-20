import UpdateOnTimestamps from "./update_stamps";
import { IGraphProcessor } from "./interface";
import { Graph } from "@dagrejs/graphlib";

export default class VariableExpander extends UpdateOnTimestamps {
  buildGraph(): void {
    super.buildGraph();
    this.expandVariables();
  }

  expandVariables() {
    this.graph.nodes().forEach(target => {
      try {
        const dependencies = this.graph.predecessors(target);
        const recipes = this.graph.node(target).recipes;
        this.graph.node(target).recipes = recipes.map(act => {
          act = act
            .replace('@TARGET', target)
            .replace('@DEPENDENCIES', dependencies.join(' '));

          dependencies.forEach((_dep, i) => {
            act = act.replace(`@DEP[${i}]`, dependencies[i])
          });
          return act;
        })
      } catch (error) {
        console.error(`Cannot find ${target} in graph`);
        process.exit(1);
      }
    });
  }
}
