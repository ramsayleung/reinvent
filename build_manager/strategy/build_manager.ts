import { IConfigLoader, IGraphBuilder, IGraphProcessor, IRunner } from "./interface";

export class BuildManager {
  constructor(
    private configLoader: IConfigLoader,
    private graphBuilder: IGraphBuilder,
    private processors: IGraphProcessor[] = [],
    private runner: IRunner
  ) {}

  async build() {
    const config = this.configLoader.load();
    const [graph, rules] = this.graphBuilder.buildGraph(config);
    this.graphBuilder.expandRules(graph, rules);

    for (const processor of this.processors) {
      await processor.process(graph);
    }

    this.runner.execute(graph);
  }
}
