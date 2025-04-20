import AddTimestamps from "./add_stamps";
import graphlib from '@dagrejs/graphlib'

export default class UpdateOnTimestamps extends AddTimestamps {
  run(): void {
    const sorted = graphlib.alg.topsort(this.graph);
    const startTime = 1 + Math.max(...sorted.map(n => this.graph.node(n).timestamp));
    console.log(`${startTime}: START`);
    const endTime = sorted.reduce((curTime, node) => {
      if (this.isStale(node)) {
        console.log(`${curTime}: ${node}`);
        this.graph.node(node).recipes.forEach(
          a => console.log(`    ${a}`)
        );
        this.graph.node(node).timestamp = curTime;
        curTime += 1
      } return curTime;
    }, startTime);
    console.log(`${endTime}: END`);
  }

  isStale(node: string) {
    return this.graph.predecessors(node).some(
      other => this.graph.node(other).timestamp >= this.graph.node(node).timestamp
    );
  }
}
