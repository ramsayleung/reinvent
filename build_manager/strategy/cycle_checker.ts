import { IGraphProcessor } from "./interface";
import graphlib from "@dagrejs/graphlib";
import assert from "assert";

// Check for cycles
export class CycleChecker implements IGraphProcessor {
  async process(graph: graphlib.Graph): Promise<void> {
    const cycles = graphlib.alg.findCycles(graph);
    assert.strictEqual(cycles.length, 0, `Dependency graph contains cycles ${cycles}`);
  }
}
