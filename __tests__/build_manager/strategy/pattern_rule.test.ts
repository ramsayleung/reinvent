import { BuildRule } from "../../../build_manager/strategy/interface"
import { PatternRuleExpander } from "../../../build_manager/strategy/pattern_rule";

describe('Test Pattern Rule expander', () => {
  test('test buildGraph success', () => {
    const config: BuildRule[] = [
      {
        target: 'left.out',
        depends: [],
        recipes: []
      },
      {
        target: 'left.in',
        depends: [],
        recipes: []
      },
      {
        target: "%.out",
        depends: ["%.in"],
        recipes: ["update @TARGET from @DEPENDENCIES"]
      }
    ];
    const expander = new PatternRuleExpander();
    const [graph, rules] = expander.buildGraph(config);
    expect(graph.nodes().length).toBe(2);
    expect(rules.size).toBe(1);
    expect(rules.has('%.out')).toEqual(true);
  })

  test('test buildGraph dependencies contain `%`', () => {
    const config: BuildRule[] = [
      {
        target: 'left.out',
        depends: ['%.in'],
        recipes: []
      },
      {
        target: 'left.in',
        depends: [],
        recipes: []
      },
    ];
    const expander = new PatternRuleExpander();
    expect(() => expander.buildGraph(config)).toThrow();
  })

  test('test findRule', () => {
    const target = "%.out";
    const rules = new Map<string, any>([
      [target, {
        depends: ["%.in"],
        recipes: ["update @TARGET from @DEPENDENCIES"]
      }]
    ]);

    const expander = new PatternRuleExpander();
    const rule = expander.findRule(target, rules);
    expect('depends' in rule).toBe(true);
    expect(rule['depends']).toStrictEqual(["%.in"]);

    expect(expander.findRule('%.not_exist', rules)).toBeNull();
  })
})
