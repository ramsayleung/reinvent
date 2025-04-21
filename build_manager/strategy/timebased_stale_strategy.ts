import { IStaleStrategy } from "./interface";
import { Graph } from "@dagrejs/graphlib";

export class TimebasedStaleStrategy implements IStaleStrategy {
  // if a target file is older than its dependencies, it's considered
  // out-of-date and must be rebuilt
  isStale(node: string, graph: Graph): boolean {
    if (graph.predecessors(node)) {
      const predecessors = graph.predecessors(node) as string[];
      return predecessors.length === 0 || predecessors.some(
        other => graph.node(other).timestamp >= graph.node(node).timestamp
      );
    }
    // no dependency, rebuild everytime
    return true;
  }
}
