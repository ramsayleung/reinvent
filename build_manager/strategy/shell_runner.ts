import graphlib from '@dagrejs/graphlib';
import { IRunner, IStaleStrategy } from "./interface";
import { executeCommand } from './command';

export class ShellRunner implements IRunner {
  constructor(private staleStrategy: IStaleStrategy, private specificTargets?: string[]) {}

  async execute(graph: graphlib.Graph): Promise<void> {
    const sorted = graphlib.alg.topsort(graph);
    let source = sorted;
    if (this.specificTargets?.length > 0) {
      source = sorted.filter(target => this.specificTargets.includes(target))
    }

    for (const target of source) {
      if (this.staleStrategy.isStale(target, graph)) {
        if (graph.node(target) && 'recipes' in graph.node(target)) {
          const recipes = graph.node(target).recipes;
          for (const recipe of recipes) {
            try {
              console.log(`${recipe}`);
              const result = await executeCommand(recipe);
              console.log(result);
            } catch (error) {
              console.error('Compilation failed:', error.message);
            }
          }
        }
      } else {
        console.log(`target: ${target} is up to date, skipping execute the recipe`)
      }
    }
  }
}
