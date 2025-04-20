import graphlib from '@dagrejs/graphlib'
import assert from 'assert'
import VariableExpander from './variable_expander'

export default class PatternUserRead extends VariableExpander {
  protected rules: Map<string, any>;
  buildGraph(): void {
    this.buildGraphAndRules();
    this.expandVariables();
  }

  buildGraphAndRules() {
    this.graph = new graphlib.Graph();
    this.rules = new Map();
    this.config.forEach(rule => {
      if (rule.target.includes('%')) {
        const data = {
          recipes: rule.recipes,
          depends: rule.depends
        }
        this.rules.set(rule.target, data);
      } else {
        const timestamp = ('timestamp' in rule) ? rule.timestamp : null;
        this.graph.setNode(rule.target, {
          recipes: rule.recipes,
          timestamp: timestamp
        });
        rule.depends.forEach(dep => {
          assert(!dep.includes('%'), 'Can not have "%"" in a non-pattern rule');
          this.graph.setEdge(dep, rule.target)
        });
      }
    })
  }
}
