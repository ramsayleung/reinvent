import { parse } from "yaml";
import { GraphCreator } from "./graph_creator";
import { readFileSync } from "fs";
import assert from "assert";

export default class AddTimestamps extends GraphCreator {
  private timeFilePath: string;
  constructor(configFilePath: string, timesFilePath: string) {
    super(configFilePath);
    this.timeFilePath = timesFilePath;
  }

  buildGraph(): void {
    super.buildGraph();
    this.addTimestamps();
  }

  addTimestamps() {
    const times = parse(readFileSync(this.timeFilePath, 'utf-8')) as Record<string, number>;
    for (const node of Object.keys(times)) {
      assert(this.graph.hasNode(node), `Graph does not has node ${node}`);
      this.graph.node(node).timestamp = times[node];
    }

    const missing = this.graph.nodes().filter(n => !('timestamp' in this.graph.node(n)));
    assert.strictEqual(missing.length, 0, `Timestamp missing for node(s) ${missing}`);
  }

  run() {
    console.log(this.graph.nodes().map(
      n => `${n}: ${JSON.stringify(this.graph.node(n))}`
    ));
  }

}
