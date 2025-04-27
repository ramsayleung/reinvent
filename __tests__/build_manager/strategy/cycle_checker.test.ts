import { BasicGraphBuilder } from "../../../build_manager/strategy/basic_graph_builder";
import { CycleChecker } from "../../../build_manager/strategy/cycle_checker";
import { BuildRule } from "../../../build_manager/strategy/interface"

describe('test cycle checker', () => {
  test('detect cycle in a graph', async () => {
    const config: BuildRule[] = [];
    config.push({
      target: "A",
      depends: ["B"],
      recipes: ["Update A from B"]
    });
    config.push({
      target: "B", depends: ["A"], recipes: ["Update B from A"]
    });
    const graphBuilder = new BasicGraphBuilder();
    const [graph, rules] = graphBuilder.buildGraph(config);
    const cycleChecker = new CycleChecker();
    await expect(() => cycleChecker.process(graph)).rejects.toThrow();
  })

  test('detect no cycle in a graph', async () => {
    const config: BuildRule[] = [];
    config.push({
      target: "A",
      depends: ["B"],
      recipes: ["Update A from B"]
    });
    config.push({
      target: "B", depends: ["C"], recipes: ["Update B from C"]
    });
    const graphBuilder = new BasicGraphBuilder();
    const [graph, rules] = graphBuilder.buildGraph(config);
    const cycleChecker = new CycleChecker();
    await expect(cycleChecker.process(graph)).resolves.not.toThrow();
  })
})
