import { BuildRule } from "../../../build_manager/strategy/interface";
import { BasicGraphBuilder } from "../../../build_manager/strategy/basic_graph_builder";
import { VariableExpandProcessor } from "../../../build_manager/strategy/variable_expander";

describe('test variable_expander', () => {
  test('no variable need to expand', () => {
    const config: BuildRule[] = [
      {
        target: "A",
        depends: ["B"],
        recipes: ["Update A from B"]
      },
      {
        target: "B",  // Must include B since A depends on it
        depends: [],
        recipes: []
      }
    ];
    const graphBuilder = new BasicGraphBuilder();
    const [graph, _rules] = graphBuilder.buildGraph(config);
    const variableExpander = new VariableExpandProcessor();
    variableExpander.process(graph);
    expect(graph.nodes().length).toBe(2);
    expect(graph.node("A").recipes).toStrictEqual(["Update A from B"]);
    expect(graph.node("B").recipes).toStrictEqual([]);
  })

  test('expand variable correctly', () => {
    const config: BuildRule[] = [
      {
        target: "A",
        depends: ["B"],
        recipes: ["Update @TARGET from @DEPENDENCIES"]
      },
      {
        target: "B",  // Must include B since A depends on it
        depends: [],
        recipes: []
      }
    ];
    const graphBuilder = new BasicGraphBuilder();
    const [graph, _rules] = graphBuilder.buildGraph(config);
    const variableExpander = new VariableExpandProcessor();
    variableExpander.process(graph);
    expect(graph.nodes().length).toBe(2);
    expect(graph.node("A").recipes).toStrictEqual(["Update A from B"]);
    expect(graph.node("B").recipes).toStrictEqual([]);
  })

  test('expand variable DEP individually', () => {
    const config: BuildRule[] = [
      {
        target: "A",
        depends: ["B"],
        recipes: ["Update @TARGET from @DEPENDENCIES"]
      },
      {
        target: "B",
        depends: ["C", "D"],
        recipes: ["Update B from @DEP[0] and @DEP[1]"]
      },
      {
        target: "C",
        depends: [],
        recipes: []
      },
      {
        target: "D",
        depends: [],
        recipes: []
      }
    ];
    const graphBuilder = new BasicGraphBuilder();
    const [graph, _rules] = graphBuilder.buildGraph(config);
    const variableExpander = new VariableExpandProcessor();
    variableExpander.process(graph);
    expect(graph.nodes().length).toBe(4);
    expect(graph.node("A").recipes).toStrictEqual(["Update A from B"]);
    expect(graph.node("B").recipes).toStrictEqual(["Update B from C and D"]);
  })
})
