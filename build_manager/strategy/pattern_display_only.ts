import { IRunner } from "./interface";
import graphlib from '@dagrejs/graphlib';
export class PatternDisplayOnly implements IRunner {
  isStale(node: string, graph: graphlib.Graph) {
    return graph.predecessors(node).some(
      other => graph.node(other).timestamp >= graph.node(node).timestamp
    );
  }
  execute(graph: graphlib.Graph): void {
    const sorted = graphlib.alg.topsort(graph);
    const startTime = 1 + Math.max(...sorted.map(n => graph.node(n).timestamp));
    console.log(`${startTime}: START`);
    const endTime = sorted.reduce((curTime, node) => {
      if (this.isStale(node, graph)) {
        console.log(`${curTime}: ${node}`);
        graph.node(node).recipes.forEach(
          a => console.log(`    ${a}`)
        );
        graph.node(node).timestamp = curTime;
        curTime += 1
      } return curTime;
    }, startTime);
    console.log(`${endTime}: END`);

  }
}
