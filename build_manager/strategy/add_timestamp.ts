import { parse } from "yaml";
import { readFileSync } from "fs";
import assert from "assert";
import { IGraphProcessor } from "./interface";
import { Graph } from "@dagrejs/graphlib";

export class AddTimestampProcessor implements IGraphProcessor {
  constructor(private timestampFile: string) {

  }

  process(graph: Graph): void {
    const times = parse(readFileSync(this.timestampFile, 'utf-8')) as Record<string, number>;
    for (const node of Object.keys(times)) {
      assert(graph.hasNode(node), `Graph does not has node ${node}`);
      graph.node(node).timestamp = times[node];
    }

    const missing = graph.nodes().filter(n => !('timestamp' in graph.node(n)));
    assert.strictEqual(missing.length, 0, `Timestamp missing for node(s) ${missing}`);
  }
}
