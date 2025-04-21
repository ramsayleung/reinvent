import { IGraphProcessor } from "./interface";
import { Graph } from "@dagrejs/graphlib";

// Expand @TARGET, @DEPENDENCIES
export class VariableExpandProcessor implements IGraphProcessor {
  async process(graph: Graph): Promise<void> {
    graph.nodes().forEach(target => {
      try {
        let dependencies = [];
        if (graph.predecessors(target)) {
          dependencies = graph.predecessors(target) as string[];
        }
        if (graph.node(target)) {
          const recipes = graph.node(target).recipes;
          graph.node(target).recipes = recipes.map(act => {
            act = act
              .replace('@TARGET', target)
              .replace('@DEPENDENCIES', dependencies.join(' '));

            dependencies.forEach((_dep, i) => {
              act = act.replace(`@DEP[${i}]`, dependencies[i])
            });
            return act;
          })
        }
      } catch (error) {
        console.error(error);
        console.error(`Cannot find ${target} in graph`);
        process.exit(1);
      }
    });
  }

}
