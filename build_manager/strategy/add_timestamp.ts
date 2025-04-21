import assert from "assert";
import { IGraphProcessor } from "./interface";
import graphlib from "@dagrejs/graphlib";
import fs from 'fs/promises'
import path from 'path';

export class AddTimestampProcessor implements IGraphProcessor {
  // use the last modification timestamp of files
  // if a target file is older than its dependencies, it's considered
  // out-of-date and must be rebuilt
  async process(graph: graphlib.Graph): Promise<void> {
    await Promise.all(graph.nodes().map(async target => {
      const filepath = path.resolve(target);
      const existingData = graph.node(target);
      try {
        const timestamp = await this.getFileLastModificationTimestamp(filepath);
        graph.setNode(target, {
          ...existingData,
          timestamp: timestamp
        });
      } catch (error) {
        console.warn(`Warning: Could not access file ${filepath}: ${error.message}`);
        // Keep existing timestamp if it exists, otherwise set to 0
        if (!('timestamp' in existingData)) {
          graph.node(target).timestamp = 0;
        }
      }
    }));

    const missing = graph.nodes().filter(n => !('timestamp' in graph.node(n)));
    assert.strictEqual(missing.length, 0, `Timestamp missing for node(s) ${missing}`);
  }

  async getFileLastModificationTimestamp(filePath: string): Promise<number> {
    try {
      const stats = await fs.stat(filePath);
      return stats.mtimeMs;
    } catch {
      return 0;
    }
  }
}
