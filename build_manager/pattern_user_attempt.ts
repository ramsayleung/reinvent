import VariableExpander from "./variable_expander";

export default class PatternUserAttempt extends VariableExpander {
  protected rules: Map<string, any>;
  buildGraph(): void {
    super.buildGraph();
    this.extractRules();
    this.expandVariables()
  }

  extractRules() {
    this.rules = new Map();
    this.graph.nodes().forEach(target => {
      if (target.includes('%')) {
        const data = {
          recipes: this.graph.node(target).recipes
        };
        this.rules.set(target, data);
      }
    });

    this.rules.forEach((_value, key) => {
      this.graph.removeNode(key);
    });
  }
}
